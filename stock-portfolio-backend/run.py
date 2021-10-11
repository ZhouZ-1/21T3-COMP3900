from app import app

import namespaces.accounts, namespaces.images, namespaces.stocks

if __name__ == "__main__":
    app.run(debug=True)
