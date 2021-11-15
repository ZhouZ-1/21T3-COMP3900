from app import app

import namespaces.accounts, namespaces.images, namespaces.stocks, namespaces.portfolio, namespaces.watchlist, namespaces.invested_performance, namespaces.collaborate

if __name__ == "__main__":
    app.run(debug=True, port=27439)
