import secrets
import bcrypt

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
