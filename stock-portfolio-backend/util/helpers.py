import secrets
import bcrypt
import smtplib
from email.message import EmailMessage
import base64

def generate_token():
    '''
    Securly generates a random token.
    '''
    return secrets.token_urlsafe(16)

def hash_password(password):
    '''
    Uses bcrypt to hash the password with a salt. Returns the hash as a string.
    '''
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode("utf-8")

def check_password(password, hashed_password):
    '''
    Takes in a password and the hash as a string, and compares the password to the hash with bcrypt.
    '''
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def generate_temp_password():
    return secrets.token_urlsafe(12)

def send_recovery_email(username, email, new_password):
    # Login to email server
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login("3900.group.group@gmail.com", "Matthew1!")

    # Set up message
    msg = EmailMessage()
    msg.set_content(f'Hello {username}, use this temporary password to login: {new_password}. Please change this as soon as possible.')
    msg['Subject'] = 'Your password has been reset'
    msg['From'] = "3900.group.group@gmail.com"
    msg['To'] = email

    # Send message
    server.send_message(msg)
    server.close()

def save_image(image_data, path):
    '''
    Saves an image in base64 format to the disk.
    '''
    with open(f"images/{path}", "wb") as fp:
        fp.write(base64.decodebytes(image_data.encode("utf-8")))

def holdings_to_csv_string(holdings):
    '''
    Takes in a list of holding dicts and returns a CSV string.
    '''
    csv_string = "holding_id,symbol,value,qty,type,brokerage,exchange,date,currency\n"
    for holding in holdings:
        csv_string += f"{holding['holding_id']},{holding['symbol']},{holding['value']},\
            {holding['qty']},{holding['type']},{holding['brokerage']},{holding['exchange']},\
            {holding['date']},{holding['currency']}\n"
    return csv_string

def csv_string_to_holdings(csv_string):
    '''
    Takes in a generic CSV string and returns a list of holding dicts.
    '''

    holdings = []

    # Extract the header
    header = csv_string.split("\n")[0]
    headers = header.split(",")

    # Convert rows to dicts
    holdings = csv_string.split("\n")[1:]
    holdings = [holding.split(",") for holding in holdings]
    holdings = [dict(zip(headers, holding)) for holding in holdings]

    return holdings
