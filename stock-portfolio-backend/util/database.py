import os
import sqlite3

base_url = 'http://127.0.0.1:5000'

# Set up sqlite3 database
database_dir = os.path.join('db')
database_file = os.path.join(database_dir, 'database.db')
if not os.path.exists(database_dir):
    os.mkdir(database_dir)
first_time_flag = False
if not os.path.exists(database_file):
    first_time_flag = True
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
        active_token text,
        watchlist varchar(255)
    );
    ''')
    cursor.execute('''
    INSERT INTO users (username, first_name, last_name, email, hashed_password, active_token, watchlist) 
    VALUES (?, ?, ?, ?, ?, ?, ?)''', [
        'test',
        'john',
        'smith',
        'test@email.com',
        '$2b$12$lR/aAeLYBwQ/.Ii..4QHKu0HS8lxF7/Rpx79vXeW/8.wy1Yw/XcAq',
        'active_token',
        '[]'
    ])
    cursor.execute('''
    CREATE TABLE stock_listing (
        symbol text PRIMARY KEY, 
        name text NOT NULL, 
        exchange text NOT NULL, 
        asset_type text
    );
    ''')
    cursor.execute('''
    CREATE TABLE portfolios (
        portfolio_id integer PRIMARY KEY AUTOINCREMENT,
        owner text NOT NULL,
        portfolio_name text NOT NULL,
        FOREIGN KEY(owner) REFERENCES users(username)
    );
    ''')
    cursor.execute('''
    CREATE TABLE holdings (
        holding_id integer PRIMARY KEY AUTOINCREMENT,
        symbol text NOT NULL,
        value real NOT NULL,
        qty real NOT NULL,
        type text CHECK(type in ('buy', 'sell')),
        brokerage real NOT NULL,
        exchange text NOT NULL,
        date text NOT NULL,
        currency text CHECK(currency in ('USD', 'AUD')),
        held_by integer NOT NULL,
        FOREIGN KEY(held_by) REFERENCES portfolios(portfolio_id)
    );
    ''')
    cursor.execute('''
    CREATE TABLE permissions (
        sharing_id integer PRIMARY KEY AUTOINCREMENT,
        portfolio_id integer NOT NULL,
        username text NOT NULL,
        status text CHECK(status in ('accepted', 'pending', 'rejected')),
        FOREIGN KEY(portfolio_id) REFERENCES portfolios(portfolio_id),
        FOREIGN KEY(username) REFERENCES users(username)
    );
    ''')
    conn.commit()
conn = sqlite3.connect('db/database.db', check_same_thread=False)

# Ensure that foreign key constraints are active.
conn.execute("PRAGMA foreign_keys = 1")
conn.commit()

def create_user(username, first_name, last_name, email, hashed_password, active_token):
    '''
    Given the username, email, password hash and active_token, adds these details to the database.
    '''
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, first_name, last_name, email, hashed_password, active_token, watchlist) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [username, first_name, last_name, email, hashed_password, active_token, '[]'])
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
    if field == "active_token":
        cursor.execute("SELECT * FROM users WHERE active_token=?", [value])
    else:
        cursor.execute(f"SELECT * FROM users WHERE UPPER({field}) LIKE UPPER(?)", [value])

    user = cursor.fetchone()

    if user is None:
        return None

    username, first_name, last_name, email, profile_image, hashed_password, active_token, watchlist = user
    return {
        "username": username,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "profile_image": f"{base_url}/images/{profile_image}",
        "hashed_password": hashed_password,
        "active_token": active_token,
        "watchlist": watchlist
    }

def update_user_by_value(username, field, value):
    '''
    Updates a user's email, password or token. 
    '''
    if field not in ["email", "first_name", "last_name", "profile_image", "hashed_password", "active_token", "watchlist"]:
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

def add_portfolio(username, portfolio_name):
    '''
    Add a portfolio to the user's account in the database.
    Returns the 
    '''
    cursor = conn.cursor()
    cursor.execute("INSERT INTO portfolios (owner, portfolio_name) values (?, ?)", [username, portfolio_name])
    conn.commit()

    # Return the portfolio_id
    return cursor.lastrowid

def query_portfolio(portfolio_id):
    '''
    Returns details about a portfolio in the database given the portfolio_id.
    '''
    cursor = conn.cursor()
    cursor.execute("SELECT * from portfolios WHERE portfolio_id=?", [portfolio_id])

    res = cursor.fetchone()
    if res is None:
        return None
    _, owner, portfolio_name = res

    return {
        "portfolio_id": portfolio_id,
        "owner": owner,
        "portfolio_name": portfolio_name
    }

def query_check_edit_permissions(portfolio_id, username):
    '''
    Returns whether the user has permissions to edit the portfolio
    '''
    cursor = conn.cursor()
    cursor.execute("SELECT username from permissions WHERE portfolio_id=? and status='accepted'", [portfolio_id])

    res = cursor.fetchall()
    if username in res:
        return True
    return False


def all_portfolios_from_user(username):
    '''
    Returns a list of all portfolio in the user's account in the database.
    '''
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM portfolios WHERE owner=?", [username])

    return [{"portfolio_id": portfolio_id, "portfolio_name": portfolio_name} for portfolio_id, _, portfolio_name in cursor.fetchall()]

def remove_portfolio(portfolio_id):
    '''
    Completely removes the correspondings and all associated stocks in the database.
    '''
    cursor = conn.cursor()
    cursor.execute("DELETE FROM holdings WHERE held_by=?", [portfolio_id])
    cursor.execute("DELETE FROM portfolios WHERE portfolio_id=?", [portfolio_id])
    conn.commit()

def update_portfolio(portfolio_id, portfolio_name):
    '''
    Updates the details of a portfolio in the database.
    '''
    cursor = conn.cursor()
    cursor.execute("UPDATE portfolios SET portfolio_name=? WHERE portfolio_id=?", [portfolio_name, portfolio_id])
    conn.commit()

def add_stock(portfolio_id, symbol, value, qty, type, brokerage, exchange, date, currency):
    '''
    Adds a stock to the user's portfolio in the database.
    '''
    cursor = conn.cursor()
    cursor.execute("INSERT INTO holdings (symbol, value, qty, type, brokerage, exchange, date, currency, held_by) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [symbol, value, qty, type, brokerage, exchange, date, currency, portfolio_id])
    conn.commit()

def get_owner_from_holding(holding_id):
    '''
    Returns the username of the owner of the holding. Returns None if the holding does not exist.
    '''
    cursor = conn.cursor()
    cursor.execute("SELECT p.portfoil FROM holdings h JOIN portfolios p ON h.held_by=p.portfolio_id WHERE holding_id=?", [holding_id])
    return cursor.fetchone()

def get_portfolio_id_from_holding(holding_id):
    '''
    Returns the portfolio_id of the holding. Returns None if the holding does not exist.
    '''
    cursor = conn.cursor()
    cursor.execute("SELECT held_by FROM holdings WHERE holding_id=?", [holding_id])
    return cursor.fetchone()

def remove_holding(holding_id):
    '''
    Removes a holding from the database.
    '''
    cursor = conn.cursor()
    cursor.execute("DELETE FROM holdings WHERE holding_id=?", [holding_id])
    conn.commit()

def update_holding(holding_id, holding_details):
    '''
    Update holding details in the database.
    '''
    cursor = conn.cursor()
    for key in holding_details.keys():
        if key in ['symbol', 'value', 'qty', 'type', 'brokerage', 'exchange', 'date', 'currency']:
            cursor.execute(f"UPDATE holdings SET {key}=? WHERE holding_id=?", [holding_details[key], holding_id])
    conn.commit()

def get_holdings(portfolio_id):
    '''
    Returns a list of holdings in the portfolio.
    '''
    cursor = conn.cursor()
    cursor.execute("SELECT * from holdings WHERE held_by=?", [portfolio_id])

    return [{
        "holding_id": holding_id,
        "symbol": symbol,
        "value": value,
        "qty": qty,
        "type": type,
        "brokerage": brokerage,
        "exchange": exchange,
        "date": date,
        "currency": currency
    } for holding_id, symbol, value, qty, type, brokerage, exchange, date, currency, _ in cursor.fetchall()]

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

def query_stocks(query, limit=5, offset=0):
    '''
    Searches the database for stocks that match the given query.
    '''
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM stock_listing WHERE symbol || name LIKE ? ORDER BY symbol asc LIMIT ? OFFSET ?", [f"%{query}%", limit, offset])

    return [{"symbol": symbol, "name": name, "exchange": exchange, "asset_type": asset_type} for symbol, name, exchange, asset_type in cursor.fetchall()]

class SearchIterator():
    """
    Iterates over all stocks
    """

    def __init__(self):
        self.cursor = conn.cursor()
        self.set_limit(10)
        self.reset_page_num()
        self.reset_max()

    def next(self):
        """
        Retrieves the next search results
        """
        # if empty stock list
        if self.max == 0:
            return {}

        if self.max <= self.limit:
            self.cursor.execute(f"SELECT * FROM stock_listing ORDER BY symbol asc")
        else:
            # check if current page is last page
            if self.page_num * self.limit < self.max:
                # not the last page so move to next
                self.page_num += 1
            
            offset = self.limit * (self.page_num - 1)

            self.cursor.execute(f"SELECT * FROM stock_listing ORDER BY symbol asc LIMIT ? OFFSET ?", [self.limit, offset])
        
        rows = self.cursor.fetchall()

        search_results = {}
        for row in rows:
            search_results[row[0]] = {
                "name": row[1],
                "exchange": row[2],
                "asset_type": row[3]
            }

        return search_results

    def back(self):
        """
        Retrieves previous search results
        """
        # if empty stock list
        if self.max == 0:
            return {}

        if self.max <= self.limit:
            self.cursor.execute(f"SELECT * FROM stock_listing ORDER BY symbol asc")
        else:
            # check if current page is first page
            if self.page_num > 1:
                # not the first page so move to prev
                self.page_num -= 1
            
            offset = self.limit * (self.page_num - 1)

            self.cursor.execute(f"SELECT * FROM stock_listing ORDER BY symbol asc LIMIT ? OFFSET ?", [self.limit, offset])
        
        rows = self.cursor.fetchall()

        search_results = {}
        for row in rows:
            search_results[row[0]] = {
                "name": row[1],
                "exchange": row[2],
                "asset_type": row[3]
            }

        return search_results

    def skip(self, skip_count):
        pass

    def set_limit(self, limit):
        self.limit = limit

    def reset_page_num(self):
        self.page_num = 0

    def reset_max(self):
        self.cursor.execute(f"SELECT count(*) FROM stock_listing")
        self.max = self.cursor.fetchone()[0]

# Run the stock listing scraper after all database functions have loaded (to avoid circular dependencies).
if first_time_flag:
    print("Running script to retrieve all stock listings...")
    print("This will take a while (approx ~3 minutes). Please wait.")
    from util.alpha_vantage_feed import dc
    dc.refresh_stock_list()
    print("Retrieved all stock listings.")
    first_time_flag=False

s_iterator = SearchIterator()