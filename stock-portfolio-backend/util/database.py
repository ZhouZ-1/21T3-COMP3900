import os
import sqlite3

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
        email text NOT NULL, 
        hashed_password text NOT NULL, 
        active_token text
    );
    ''')
    cursor.execute('''
    INSERT INTO users (username, email, hashed_password, active_token) 
    VALUES (?, ?, ?, ?)''', [
        'test',
        'test@email.com',
        '$2b$12$lR/aAeLYBwQ/.Ii..4QHKu0HS8lxF7/Rpx79vXeW/8.wy1Yw/XcAq',
        'active_token'
    ])
    cursor.execute('''
    CREATE TABLE stock_listing (
        symbol text PRIMARY KEY, 
        name text NOT NULL, 
        exchange text NOT NULL, 
        asset_type text
    );
    ''')
    conn.commit()
conn = sqlite3.connect('db/database.db', check_same_thread=False)


def create_user(username, email, hashed_password, active_token):
    '''
    Given the username, email, password hash and active_token, adds these details to the database.
    '''
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, email, hashed_password, active_token) VALUES (?, ?, ?, ?)',
        [username, email, hashed_password, active_token])
    conn.commit()

def get_user_by_value(field, value):
    '''
    Retrieves a user's details from either their username, email or active token.
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

    username, email, hashed_password, active_token = user
    return {
        "username": username,
        "email": email,
        "hashed_password": hashed_password,
        "active_token": active_token
    }

def update_user_by_value(username, field, value):
    '''
    Updates a user's email, password or token. 
    '''
    if field not in ["email", "hashed_password", "active_token"]:
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

"""
    Stock table functions
"""
def update_stock_listing(symbol, name, exchange, asset_type):
    '''
    Updates a stocks basic information 
    '''
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM stock_listing WHERE symbol= ?", [symbol])
    if cursor.fetchone() is None:
        cursor.execute('INSERT INTO stock_listing (symbol, name, exchange, asset_type) VALUES (?, ?, ?, ?)',
        [symbol, name, exchange, asset_type])
    else:
        cursor.execute(f"UPDATE stock_listing SET name = ?, exchange = ?, asset_type = ? WHERE symbol = ?",
        [name, exchange, asset_type, symbol])

    conn.commit()

class SearchIterator():
    """
    Iterates over all stocks
    """
    def __init__(self):
        self.offset = 0
        self.limit = 10
        self.cursor = conn.cursor()
        self.max = self.get_max_rows()

    def next(self):
        """
        Retrieves the next search results
        """
        overall_offset = self.limit * self.offset
        self.cursor.execute(f"SELECT * FROM stock_listing  ORDER BY symbol asc LIMIT ? OFFSET ?", [self.limit, self.offset])
        rows = self.cursor.fetchall()

        self.offset += 1

        search_results = {}
        for row in rows:
            search_results[row[0]] = {
                "name": row[1],
                "exchange": row[2],
                "asset_type": row[3]
            }

        return search_results

    def get_max_rows(self):
        self.cursor.execute(f"SELECT count(*) FROM stock_listing")
        result = self.cursor.fetchone()
        return result[0]

s_iterator = SearchIterator()