from app import app

import namespaces.accounts, namespaces.images, namespaces.stocks, namespaces.watchlist

if __name__ == "__main__":
    app.run(debug=True)
