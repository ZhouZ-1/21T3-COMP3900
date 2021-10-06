import os, sys
import sqlite3

# Set up sqlite3 database
database_dir = os.path.join('db')
database_file = os.path.join(database_dir, 'database.db')
if not os.path.exists(database_dir):
    os.mkdir(database_dir)
if not os.path.exists(database_file):
    conn = sqlite3.connect('db/database.db')
    c = conn.cursor()
    c.execute('CREATE TABLE IF NOT EXISTS users (username text PRIMARY KEY, email text NOT NULL, hashed_password text NOT NULL, salt text NOT NULL);')
    c.execute('INSERT INTO users (username, email, hashed_password) VALUES (test, test@email.com, $2b$12$lR/aAeLYBwQ/.Ii..4QHKu0HS8lxF7/Rpx79vXeW/8.wy1Yw/XcAq)')
