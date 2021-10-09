import os
import sqlite3

base_url = 'http://127.0.0.1'

# Set up sqlite3 database
database_dir = os.path.join('db')
database_file = os.path.join(database_dir, 'database.db')
if not os.path.exists(database_dir):
    os.mkdir(database_dir)
if not os.path.exists(database_file):
    conn = sqlite3.connect('db/database.db')
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE users (
        username text PRIMARY KEY,
        first_name text NOT NULL,
        last_name text NOT NULL,
        email text NOT NULL,
        profile_image text DEFAULT 'default.jpg',
        hashed_password text NOT NULL, 
        active_token text
    );
    ''')
    cursor.execute('''
    INSERT INTO users (username, first_name, last_name, email, hashed_password, active_token) 
    VALUES (?, ?, ?, ?, ?, ?)''', [
        'test',
        'john',
        'smith',
        'test@email.com',
        '$2b$12$lR/aAeLYBwQ/.Ii..4QHKu0HS8lxF7/Rpx79vXeW/8.wy1Yw/XcAq',
        'active_token'
    ])
    conn.commit()
conn = sqlite3.connect('db/database.db', check_same_thread=False)


def create_user(username, first_name, last_name, email, hashed_password, active_token):
    '''
    Given the username, email, password hash and active_token, adds these details to the database.
    '''
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, first_name, last_name, email, hashed_password, active_token) VALUES (?, ?, ?, ?, ?, ?)',
        [username, first_name, last_name, email, hashed_password, active_token])
    conn.commit()

def get_user_by_value(field, value):
    '''
    Retrieves a user's details from either their username, first name, last name, email or active token.
    '''
    # Check that only certain fields can be searched
    if field not in ["username", "email", "active_token"]:
        return None

    # Query db to retrieve user
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM users WHERE {field}=?", [value])

    user = cursor.fetchone()

    if user is None:
        return None

    username, first_name, last_name, email, profile_image, hashed_password, active_token = user
    return {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "profile_image": f"{base_url}/images/{profile_image}",
        "hashed_password": hashed_password,
        "active_token": active_token
    }

def update_user_by_value(username, field, value):
    '''
    Updates a user's email, password or token. 
    '''
    if field not in ["email", "first_name", "last_name", "profile_image", "hashed_password", "active_token"]:
        return None
    
    cursor = conn.cursor()
    cursor.execute(f"UPDATE users SET {field}=? WHERE username=?", [value, username])
    conn.commit()

def delete_user(username):
    '''
    Removes a user from the database.
    '''
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE username=?", [username])
    conn.commit()
