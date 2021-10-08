import secrets
import bcrypt
import smtplib
from email.message import EmailMessage

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
