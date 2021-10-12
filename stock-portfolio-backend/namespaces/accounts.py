from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import register_model, login_model, token_model, change_password_model, \
    recover_model, success_model, details_model, update_details_model
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
        first_name = body['first_name']
        last_name = body['last_name']
        email = body['email'].lower()
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
        db.create_user(username, first_name, last_name, email, hashed_password, token)

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

@accounts.route('/details', doc={
    "description": "Retrieves the details of the given user by their token"
})
class Details(Resource):
    @accounts.expect(token_model)
    @accounts.response(200, 'Success', details_model)
    @accounts.response(401, 'Invalid token')
    def put(self):
        token = request.json['token']

        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Returns the user and remove sensitive information.
        user.pop("active_token")
        user.pop("hashed_password")
        return user

@accounts.route('/update-details', doc={
    "description": "Allows the user to change their details such as email, first name, or last name if they are logged in."
})
class UpdateDetails(Resource):
    @accounts.expect(update_details_model)
    @accounts.response(200, 'Success', success_model)
    @accounts.response(400, 'Invalid field')
    @accounts.response(401, 'Invalid token')
    @accounts.response(409, 'Email is registered to another account.')
    def put(self):
        body = request.json
        token = body['token']
        field = body['field']
        value = body['value']

        # Check that the token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

        # Check that the field is valid
        if field not in ["email", "first_name", "last_name"]:
            abort(400, f"{field} is an invalid field to change")

        # Check that the email is not already in use
        if field == "email" and db.get_user_by_value("email", value):
            abort(409, f"Email {value} is already in use") 

        # Change the user's details
        db.update_user_by_value(user["username"], field, value)

        return {
            "is_success": True
        }

@accounts.route('/update-password', doc={
    "description": "Allows the user to change their password if they are logged in."
})
class UpdatePassword(Resource):
    @accounts.expect(change_password_model)
    @accounts.response(200, 'Success', success_model)
    @accounts.response(400, 'Username/Password is incorrect')
    def put(self):
        body = request.json
        token = body['token']
        old_password = body['old_password']
        new_password = body['new_password']

        # Check that the user is logged in
        user = db.get_user_by_value("active_token", token)

        # Check that the user exists
        if not user or token == "":
            abort(400, "User is not logged in")
        
        # Check if password is valid
        if len(new_password) < 8 or len(list(filter(str.isdigit, new_password))) == 0 or \
            len(list(filter(str.isalpha, new_password))) == 0:
            abort(400,'Password does not meet requirements')

        # Check that the old password is correct
        if not check_password(old_password, user["hashed_password"]):
            abort(400, "Old password is incorrect")

        # If new password is old password
        if old_password == new_password:
            abort(400, "New password is the same as the old password")

        # Hash password
        hashed_password = hash_password(new_password)
        db.update_user_by_value(user["username"], "hashed_password", hashed_password)

        return {
            "is_success": True
        }

@accounts.route('/logout', doc={
    "description": "Notifies the backend that a user has logged out. Their token will be removed from the database"
})
class Logout(Resource):
    '''
    Allows the user to logout.
    '''
    @accounts.expect(token_model)
    @accounts.response(200, 'Success', success_model)
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
    @accounts.response(401, 'Invalid token')

    def delete(self):
        token = request.json['token']

        # Check that token is valid
        user = db.get_user_by_value("active_token", token)
        if not user or token == "":
            abort(401, "Invalid token")

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
    @accounts.response(200, 'success', success_model)
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
