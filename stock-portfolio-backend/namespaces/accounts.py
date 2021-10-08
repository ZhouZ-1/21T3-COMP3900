from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import register_model, login_model, token_model, change_password_model, \
    recover_model, success_model
from util.helpers import generate_token, hash_password, check_password, generate_temp_password, \
    send_recovery_email

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
    '''
    Lets the user login with their username and password.
    '''
    @accounts.expect(login_model)
    @accounts.response(200, 'Success', token_model)
    @accounts.response(400, 'Username/Password is incorrect')

    def post(self):
        body = request.json
        username = body['username']
        password = body['password']

        # Check that the user exists
        user = db.get_user_by_value("username", username)
        if not user:
            abort(400, "Username does not exists")

        # Check that the password is correct
        if not check_password(password, user["hashed_password"]):
            abort(400, "Password is incorrect")

        # Generate a new token
        token = generate_token()

        # Update the user's token
        db.update_user_by_value(username, "active_token", token)

        return {
            'token': token
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
    '''
    Allows the user to logout.
    '''
    @accounts.expect(token_model)
    @accounts.response(400, 'Token does not exist')
    def post(self):
        body = request.json
        token = body['token']
        
        # Check that the token exists
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        db.update_user_by_value(user['username'], "active_token", "")

        return {
            "is_success": True
        }

@accounts.route('/delete', doc={
    "description": "Permantly deletes a user's account and their corresponding data."
})
class Delete(Resource):
    @accounts.expect(token_model)
    @accounts.response(200, 'Success', success_model)
    @accounts.response(400, 'Invalid token')

    def delete(self):
        token = request.json['token']

        # Check that token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(400, "Invalid token")

        # Do after portfolio implemented: remove all corresponding portfolio information from user.

        # Remove user from database
        db.delete_user(user["username"])

        return {
            "is_success": True
        }

@accounts.route('/recover', doc={
    "description": "Reset the user's password so that they can continue to use our service. \
        Does nothing if email if the email is invalid."
})
class Recover(Resource):
    @accounts.expect(recover_model)
    @accounts.response(200, success_model)
    def post(self):
        email = request.json['email']

        # Do nothing if email doesn't exist
        user = db.get_user_by_value("email", email)
        if user:
            # Generate new email and email the user.
            temp_password = generate_temp_password()
            db.update_user_by_value(user["username"], "hashed_password", hash_password(temp_password))
            send_recovery_email(user["username"], email, temp_password)

        return {
            "is_success": True
        }
