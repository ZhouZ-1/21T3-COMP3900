from app import api, db
from flask_restplus import Resource, abort
from util.models import register_model, login_model, token_model, change_password_model, recover_model
from flask import request

accounts = api.namespace('accounts', description='Account Creation and Management')

@accounts.route('/register', doc={"description": "Allows the user to sign up and create an account."})
class Register(Resource):
    @accounts.expect(register_model)
    @accounts.response(200, 'Success', token_model)
    def post(self):
        return {
            'token': 'dummy_token'
        }

@accounts.route('/login', doc={"description": "Allows the user to sign in."})
class Login(Resource):
    @accounts.expect(login_model)
    @accounts.response(200, 'Success', token_model)
    def post(self):
        return {
            'token': 'dummy_token'
        }

@accounts.route('/update', doc={"description": "Allows the user to change their password if they are logged in."})
class Update(Resource):
    @accounts.expect(change_password_model)
    def put(self):
        return {}

@accounts.route('/logout', doc={"description": "Notifies the backend that a user has logged out. Their token will be removed from the database"})
class Logout(Resource):
    @accounts.expect(token_model)
    def post(self):
        return {}

@accounts.route('/delete', doc={"description": "Permantly deletes a user's account and their corresponding data."})
class Delete(Resource):
    @accounts.expect(token_model)
    def delete(self):
        return {}

@accounts.route('/recover', doc={"description": "Reset the user's password so that they can continue to use our service."})
class Recover(Resource):
    @accounts.expect(recover_model)
    def post(self):
        return {}
