from flask_restplus import fields
from app import api

login_model = api.model('login_model', {
    "username": fields.String(required=True, example="johnsmith"),
    "password": fields.String(required=True, example="hunter2"),
})

register_model = api.inherit('register_model', login_model, {
    "email": fields.String(required=True, example="john@email.com")
})

token_model = api.model('token_model', {
    'token': fields.String(required=True)
})

change_password_model = api.inherit('change_password_model', token_model, {
    "new_password": fields.String(required=True)
})

recover_model = api.inherit('recover_model', {
    "email": fields.String(required=True, example="john@email.com")
})

success_model = api.model('success_model', {
    "is_success": fields.Boolean()
})

search_model = api.model('search_model', {
    "symbol": fields.String(required=True, example="GOOG")
})