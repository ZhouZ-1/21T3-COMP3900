from flask_restplus import fields
from app import api

login_model = api.model('login_model', {
    "username": fields.String(required=True, example="johnsmith"),
    "password": fields.String(required=True, example="hunter22"),
})

register_model = api.inherit('register_model', login_model, {
    "first_name": fields.String(required=True, example="john"),
    "last_name": fields.String(required=True, example="smith"),
    "email": fields.String(required=True, example="john@email.com")
})

token_model = api.model('token_model', {
    'token': fields.String(required=True)
})

change_password_model = api.inherit('change_password_model', token_model, {
    "old_password": fields.String(required=True),
    "new_password": fields.String(required=True)
})

recover_model = api.inherit('recover_model', {
    "email": fields.String(required=True, example="john@email.com")
})

success_model = api.model('success_model', {
    "is_success": fields.Boolean()
})

details_model = api.model('details_model', {
    "username": fields.String(required=True, example="user100"),
    "first_name": fields.String(required=True, example="john"),
    "last_name": fields.String(required=True, example="smith"),
    "email": fields.String(required=True, example="john@email.com"),
    "profile_image": fields.String(required=True, example="http://127.0.0.1:5000/images/default.png")
})

update_details_model = api.inherit('update_details_model', token_model, {
    "field": fields.String(required=True, description="The field to update"),
    "value": fields.String(required=True, description="The value of the field after updating.")
})
