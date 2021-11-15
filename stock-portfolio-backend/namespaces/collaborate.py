from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import *
from util.helpers import *

collaborate = api.namespace('collaborate', description='Collaborative Portfolio')

@collaborate.route('/shared-with-me', doc={
    'description': 'Returns a list of portfolios shared with the user'
})
@collaborate.param('token', description="The user's token", type=str, required=True)
class SharedWithMe(Resource):
    @collaborate.response(200, 'Success', [shared_with_me_model])
    def get(self):
        token = request.args.get('token')
        
        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Get the list of portfolios shared with the user
        shared_with_user = db.get_shared_with_user(user["username"])
        
        return shared_with_user

@collaborate.route('/sharing-with-others', doc={
    'description': 'Returns a list of portfolios that you are sharing with other people'
})
@collaborate.param('token', description="The user's token", type=str, required=True)
class SharingWithOthers(Resource):
    @collaborate.response(200, 'Success', [sharing_with_others_model])
    def get(self):
        token = request.args.get('token')
        
        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")
            
        # Get the list of portfolios that the user is sharing with other people
        sharing_with_others = db.get_sharing_with_others(user["username"])
        
        return sharing_with_others

@collaborate.route('/send', doc={
    'description': 'Sends an invite to collaborate on a portfolio to another user',
})
class Send(Resource):
    @collaborate.expect(send_invite_model)
    @collaborate.response(200, 'Success', success_model)
    def post(self):
        body = request.json
        token = body['token']
        portfolio_id = body['portfolio_id']
        username = body['username']

        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Check that user owns the portfolio.
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or portfolio["owner"] != user["username"]:
            abort(400, "User does not own portfolio")

        # Check that the user exists
        if not db.get_user_by_value("username", username) or username == user["username"]:
            abort(400, "Invalid username")

        # Check that the user is not already collaborating on the portfolio
        status = db.get_permission_status(portfolio_id, username)
        if status == "accepted":
            abort(400, "User is already collaborating on portfolio")
        elif status == "pending":
            abort(400, "Invite already sent to user")
        elif status == "rejected":
            abort(400, "User has rejected invite")

        # Send the invite
        db.send_invite(portfolio_id, username)

        return {
            "is_success": True
        }

@collaborate.route('/check', doc={
    'description': 'Checks if a user has recieved an invite to collaborate on a portfolio',
})
@collaborate.param('token', description="The user's token", type=str, required=True)
class Check(Resource):
    @collaborate.response(200, 'Success', [invite_model])
    def get(self):
        token = request.args.get('token')
        
        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Check if the user has any invites
        pending = db.check_pending_invites(user["username"])
        
        return pending

@collaborate.route('/reply', doc={
    'description': 'Responds to an invite to collaborate on a portfolio',
})
class Reply(Resource):
    @collaborate.expect(reply_model)
    @collaborate.response(200, 'Success', success_model)
    def post(self):
        body = request.json
        token = body['token']
        sharing_id = body['sharing_id']
        accepted = body['accepted']
        
        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Check that the sharing_id exists and belongs to the user
        sharing_details = db.get_sharing_details(sharing_id)
        if (sharing_details is None or sharing_details["username"] != user["username"]):
            abort(400, "Invalid sharing_id")
            
        # Check that the user is not already collaborating on the portfolio
        if sharing_details["status"] == "accepted":
            abort(400, "User is already collaborating on portfolio")
            
        # Accept or reject the invite
        if (accepted):
            db.accept_invite(sharing_id)
        else:
            db.reject_invite(sharing_id)

        return {
            "is_success": True
        }

# might not need new routes for holdings 
@collaborate.route('/add-holding', doc={
    'description': 'Adds a holding to a collabortive portfolio',
})
class Add(Resource):
    @collaborate.expect(add_stock_model)
    @collaborate.response(200, 'Success', success_model)
    def post(self):

        # check if below can be done by just redirecting
        """
        Add a holding to the portfolio.
        """
        body = request.json
        portfolio_id = body['portfolio_id']
        symbol = body['symbol']
        value = body['value']
        qty = body['qty']
        type = body['type']
        brokerage = body['brokerage']
        exchange = body['exchange']
        date = body['date']
        currency = body['currency']
        token = body['token']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid") 

        # Check that user owns or has edit permissions for the portfolio
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or not(portfolio["owner"] == user["username"] or not db.query_check_edit_permissions(portfolio_id, user['username'])):
            abort(400, "User does not have permission to add stocks to the portfolio")

        # Check that the type is either buy or sell.
        if type not in ['buy', 'sell']:
            abort(400, "Type is invalid")

        # Add stock to portfolio.
        db.add_stock(portfolio_id, symbol, value, qty, type, brokerage, exchange, date, currency)
        return {
            "is_success": True
        }

@collaborate.route('/edit-holding', doc={
    'description': 'Edits a holding in a collabortive portfolio',
})
class Edit(Resource):
    @collaborate.expect(edit_stock_model)
    @collaborate.response(200, 'Success', success_model)
    @collaborate.response(400, 'Invalid token')
    def put(self):
        """
        Edit holding details.
        """
        body = request.json
        token = body['token']
        holding_id = body['holding_id']
        
        holding_details = body
        holding_details.pop('token')
        holding_details.pop('holding_id')

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")
        
        # Check that user owns or has edit permissions for the portfolio
        portfolio_id = db.get_portfolio_id_from_holding(holding_id)
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or not (portfolio["owner"] == user["username"] or db.query_check_edit_permissions(portfolio_id, user['username'])):
            abort(400, "User cannot access this holding.")

        # Update holding details.
        db.update_holding(holding_id, holding_details)

        return {
            "is_success": True
        }

@collaborate.route('/remove-holding', doc={
    'description': 'Removes a holding from a collabortive portfolio',
})
class Remove(Resource):
    @collaborate.expect(delete_holding_model)
    @collaborate.response(200, 'Success', success_model)
    def delete(self):
        """
        Deletes a holding from the portfolio.
        """
        body = request.json
        holding_id = body['holding_id']
        token = body['token']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

         # Check that user owns or has edit permissions for the portfolio
        portfolio_id = db.get_portfolio_id_from_holding(holding_id)
        if portfolio_id is None:
            abort(400, "Holding does not exist")
        if not db.query_check_edit_permissions(portfolio_id, user['username']):
            abort(400, "User cannot access this holding.")

        # Delete the holding.
        db.remove_holding(holding_id)

        return {
            "is_success": True
        }

@collaborate.route('/portfolio/summary', doc={
    "description": "Retrieve a summary of all the user's portfolios"
})
class Summary(Resource):
    @collaborate.expect(get_holdings_model)
    @collaborate.response(200, 'Success', summary_response_model)
    @collaborate.response(400, 'Invalid token')
    def post(self):
        """
        Returns a summary of a user's portfolio data combined together. 
        """
        body = request.get_json()
        token = body["token"]
        portfolio_id = body["portfolio_id"]

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user has permission to access the portfolio corresponding to the portfolio_id.
        if len([p for p in db.get_shared_with_user(user["username"]) if p["portfolio_id"] == portfolio_id]) == 0:
            abort(400, "User does not have permission to access this portfolio.")

        # Retrieve list of holdings from portfolio.
        holdings = db.get_holdings(portfolio_id)

        # Return a list of holdings.
        return {
            "holdings": holdings_summary(holdings)
        }

@collaborate.route('/portfolio/holdings', doc={
    "description": "View a list of holdings that is in a portfolio, given the portfolio_id."
})
class GetHoldings(Resource):
    @collaborate.expect(get_holdings_model)
    @collaborate.response(200, 'Success', holdings_response_model)
    @collaborate.response(400, 'Invalid token')
    def post(self):
        """
        Retrieve holdings from portfolio.
        """
        body = request.json
        token = body['token']
        portfolio_id = body['portfolio_id']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user has permission to access the portfolio corresponding to the portfolio_id.
        if len([p for p in db.get_shared_with_user(user["username"]) if p["portfolio_id"] == portfolio_id]) == 0:
            abort(400, "User does not have permission to access this portfolio.")

        # Retrieve list of holdings from portfolio.
        holdings = db.get_holdings(portfolio_id)

        return holdings

@collaborate.route('/revoke-permission', doc={
    'description': 'Revokes a user\'s permission to view and edit a collabortive portfolio',
})
class Revoke(Resource):
    @collaborate.expect(revoke_permission_model)
    @collaborate.response(200, 'Success', success_model)
    def delete(self):
        body = request.json
        token = body['token']
        sharing_id = body['sharing_id']
        
        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Get the owner of the sharing id
        owner = db.get_owner_of_shared_portfolio(sharing_id)
        if owner != user["username"]:
            abort(400, "User does not have permission to revoke permission")
            
        # Revoke the permission
        db.reject_invite(sharing_id)

        return {
            "is_success": True
        }
