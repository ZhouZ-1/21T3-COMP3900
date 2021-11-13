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
        return [
            {
                "sharing_id": 1, 
                "portfolio_id": 1, 
                "portfolio_name": "Shared Portfolio", 
                "owner": "test"
            }
        ]

@collaborate.route('/sharing-with-others', doc={
    'description': 'Returns a list of portfolios that you are sharing with other people'
})
@collaborate.param('token', description="The user's token", type=str, required=True)
class SharingWithOthers(Resource):
    @collaborate.response(200, 'Success', [sharing_with_others_model])
    def get(self):
        return [
            {
                "portfolio_id": 1,
                "portfolio_name": "Shared Portfolio",
                "shared_with": [
                    {
                        "username": "test",
                        "sharing_id": 1
                    }
                ]
            }
        ]

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
        return [
            {
                "sharing_id": 1,
                "portfolio_id": 1,
                "portfolio_name": "Shared Portfolio",
                "owner": "test"
            }
        ]

@collaborate.route('/reply', doc={
    'description': 'Responds to an invite to collaborate on a portfolio',
})
class Reply(Resource):
    @collaborate.expect(reply_model)
    @collaborate.response(200, 'Success', success_model)
    def post(self):
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
        if portfolio is None or not(portfolio["owner"] == user["username"] or not query_check_edit_permissions(portfolio_id, user['username'])):
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
        if portfolio is None or not (portfolio["owner"] == user["username"] or query_check_edit_permissions(portfolio_id, user['username'])):
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
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or not(portfolio["owner"] == user["username"] or query_check_edit_permissions(portfolio_id, user['username'])):
            abort(400, "User cannot access this holding.")

        # Delete the holding.
        db.remove_holding(holding_id)

        return {
            "is_success": True
        }

@collaborate.route('/revoke-permission', doc={
    'description': 'Revokes a user\'s permission to view and edit a collabortive portfolio',
})
class Revoke(Resource):
    @collaborate.expect(revoke_permission_model)
    @collaborate.response(200, 'Success', success_model)
    def delete(self):
        return {
            "is_success": True
        }
