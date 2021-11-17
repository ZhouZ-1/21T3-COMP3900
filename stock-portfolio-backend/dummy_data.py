import sqlite3
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
    print('Removing dummy data')
    conn = sqlite3.connect('db/database.db', check_same_thread=False)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM portfolios")
    cursor.execute("DELETE FROM holdings")
    cursor.execute("DELETE FROM permissions")
    conn.commit()

    sys.exit(0)

# Create 3 users
frank_token = generate_token()
db.create_user(
    username="frank",
    first_name="Frank",
    last_name="Nguyen",
    email="fnguyen344@gmail.com",
    hashed_password=hash_password("password"),
    active_token=frank_token
)
db.add_portfolio("frank", "main-portfolio")
db.add_stock(
    portfolio_id="1",
    symbol="GOOG",
    value=231.234,
    qty=42,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="19/10/2021",
    currency="USD"
)
db.add_stock(
    portfolio_id="1",
    symbol="IBM",
    value=39.234,
    qty=22,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="25/03/2020",
    currency="USD"
)
db.add_stock(
    portfolio_id="1",
    symbol="TSLA",
    value=89.824,
    qty=8,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="12/05/2021",
    currency="USD"
)

db.add_portfolio("frank", "something-portfolio")
db.add_stock(
    portfolio_id="2",
    symbol="TSLA",
    value=89.824,
    qty=8,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="12/05/2021",
    currency="USD"
)
db.add_stock(
    portfolio_id="2",
    symbol="ASX",
    value=8.824,
    qty=16,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="15/09/2021",
    currency="USD"
)

db.add_portfolio("frank", "my-portfolio1")
db.add_stock(
    portfolio_id="3",
    symbol="STK",
    value=12.345,
    qty=39,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="31/10/2021",
    currency="USD"
)

db.add_portfolio("frank", "my-portfolio2")


jack_token = generate_token()
db.create_user(
    username="jack",
    first_name="jack",
    last_name="Smith",
    email="joe@joe.joe",
    hashed_password=hash_password("password"),
    active_token=jack_token
)
db.add_portfolio("jack", "primary-portfolio")
db.add_stock(
    portfolio_id="5",
    symbol="STK",
    value=32.712,
    qty=27,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="06/02/2021",
    currency="USD"
)
db.add_stock(
    portfolio_id="5",
    symbol="BA",
    value=3.712,
    qty=82,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="17/07/2021",
    currency="USD"
)

db.add_portfolio("jack", "portfolio")
db.add_stock(
    portfolio_id="6",
    symbol="ABC",
    value=84.163,
    qty=57,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="17/07/2021",
    currency="USD"
)
db.add_stock(
    portfolio_id="6",
    symbol="DEF",
    value=68.184,
    qty=4,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="09/12/2021",
    currency="USD"
)

db.add_portfolio("jack", "misc")
db.add_stock(
    portfolio_id="7",
    symbol="DEF",
    value=68.184,
    qty=9,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="05/03/2021",
    currency="USD"
)
db.add_stock(
    portfolio_id="7",
    symbol="LMN",
    value=84.112,
    qty=2,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="09/07/2021",
    currency="USD"
)


jane_token = generate_token()
db.create_user(
    username="jane",
    first_name="Jane",
    last_name="Smith",
    email="jane@jane.jane",
    hashed_password=hash_password("password"),
    active_token=jane_token
)
db.add_portfolio("jane", "my portfolio")
db.add_stock(
    portfolio_id="8",
    symbol="LMN",
    value=84.112,
    qty=2,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="09/07/2021",
    currency="USD"
)
db.add_stock(
    portfolio_id="8",
    symbol="PQR",
    value=0.358,
    qty=84,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="09/07/2021",
    currency="USD"
)

db.add_portfolio("jane", "portport")
db.add_stock(
    portfolio_id="9",
    symbol="LMN",
    value=36.003,
    qty=7,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="09/07/2021",
    currency="USD"
)
db.add_stock(
    portfolio_id="9",
    symbol="ABC",
    value=88.211,
    qty=11,
    type="buy",
    brokerage=9.95,
    exchange="NYSE",
    date="09/07/2021",
    currency="USD"
)

db.add_portfolio("jane", "stockNetf")
