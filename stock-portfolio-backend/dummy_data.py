from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import register_model, login_model, token_model, change_password_model, \
    recover_model, success_model, details_model, update_details_model
from util.helpers import generate_token, hash_password, check_password, generate_temp_password, \
    send_recovery_email
import sys

# Remove dummy users
if len(sys.argv) > 1 and sys.argv[1] == 'remove':
    db.delete_user("frank")
    db.delete_user("jack")
    db.delete_user("jane")
    sys.exit()

# Create 3 users
db.create_user(
    username="frank",
    first_name="Frank",
    last_name="Nguyen",
    email="fnguyen344@gmail.com",
    hashed_password=hash_password("password"),
    active_token=generate_token()
)
db.add_portfolio("frank", "main-portfolio")
db.add_portfolio("frank", "something-portfolio")
db.add_portfolio("frank", "my-portfolio1")
db.add_portfolio("frank", "my-portfolio2")

db.create_user(
    username="jack",
    first_name="jack",
    last_name="Smith",
    email="joe@joe.joe",
    hashed_password=hash_password("password"),
    active_token=generate_token()
)
db.add_portfolio("jack", "primary-portfolio")
db.add_portfolio("jack", "portfolio")
db.add_portfolio("jack", "misc")

db.create_user(
    username="jane",
    first_name="Jane",
    last_name="Smith",
    email="jane@jane.jane",
    hashed_password=hash_password("password"),
    active_token=generate_token()
)
db.add_portfolio("jane", "my portfolio")
db.add_portfolio("jane", "portport")
db.add_portfolio("jane", "stockNetf")
