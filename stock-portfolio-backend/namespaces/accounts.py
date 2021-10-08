from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import register_model, login_model, token_model, change_password_model, \
    recover_model
from util.helpers import generate_token, hash_password

accounts = api.namespace('accounts', description='Account Creation and Management')

@accounts.route('/register', doc={
    "description": "Allows the user to sign up and create an account."
})
class Register(Resource):
    '''
    Allows the frontend to register a user by providing the required information.
    '''
    @accounts.expect(register_model)
    @accounts.response(200, 'Success', token_model)
    @accounts.response(400, 'Incorrect username/password')
    @accounts.response(409, 'Username or email is taken')

    def post(self):
        body = request.json
        username = body['username']
        email = body['email']
        password = body['password']

        # Check if password is valid
        if len(password) < 8 or len(list(filter(str.isdigit, password))) == 0 or \
            len(list(filter(str.isalpha, password))) == 0:
            abort(400,'Password does not meet requirements')

        # Check if username or email is already taken
        if db.get_user_by_value("username", username) or \
            db.get_user_by_value("email", email):
            abort(409,'Username or email is already registered.')

        # Hash password
        hashed_password = hash_password(password)

        # Create token
        token = generate_token()

        # Add user to the database
        db.create_user(username, email, hashed_password, token)

        return {
            'token': token
        }

@accounts.route('/login', doc={"description": "Allows the user to sign in."})
class Login(Resource):
    @accounts.expect(login_model)
    @accounts.response(200, 'Success', token_model)
    def post(self):
        return {
            'token': 'dummy_token'
        }

@accounts.route('/update', doc={
    "description": "Allows the user to change their password if they are logged in."
})
class Update(Resource):
    @accounts.expect(change_password_model)
    def put(self):
        return {}

@accounts.route('/logout', doc={
    "description": "Notifies the backend that a user has logged out. Their token will be removed from the database"
})
class Logout(Resource):
    @accounts.expect(token_model)
    def post(self):
        return {}

@accounts.route('/delete', doc={
    "description": "Permantly deletes a user's account and their corresponding data."
})
class Delete(Resource):
    @accounts.expect(token_model)
    def delete(self):
        return {}

@accounts.route('/recover', doc={"description": "Reset the user's password so that they can continue to use our service."})
class Recover(Resource):
    @accounts.expect(recover_model)
    def post(self):
        return {}
