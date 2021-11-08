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
