from app import api
from flask_restplus import fields

login_model = api.model('login_model', {
    "username": fields.String(required=True, example="johnsmith"),
    "password": fields.String(required=True, example="hunter2"),
})

register_model = api.inherit('register_model', login_model, {
    "email": fields.String(required=True, example="john@email.com")
})

token_model = api.model('token_model', {
    'token': fields.String()
})

change_password_model = api.inherit('change_password_model', token_model, {
    "new_password": fields.String(required=True)
})

recover_model = api.inherit('recover_model', {
    "email": fields.String(required=True, example="john@email.com")
})