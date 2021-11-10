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

@collaborate.route('/add-holding', doc={
    'description': 'Adds a holding to a collabortive portfolio',
})
class Add(Resource):
    @collaborate.expect(add_stock_model)
    @collaborate.response(200, 'Success', success_model)
    def post(self):
        return {
            "is_success": True
        }

@collaborate.route('/edit-holding', doc={
    'description': 'Edits a holding in a collabortive portfolio',
})
class Edit(Resource):
    @collaborate.expect(edit_stock_model)
    @collaborate.response(200, 'Success', success_model)
    def put(self):
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
