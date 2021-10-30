from flask import request, send_file, Response
from flask_restplus import Resource, abort
from app import api, db
from util.models import *
from util.helpers import *

portfolio = api.namespace('portfolio', description='Portfolio management: Add, Edit, Sell, Delete holdings in your portfolios.')

@portfolio.route('', doc={
    "description": "Get data on the user's current portfolios"
})
@portfolio.param('token', description="The user's token", type=str, required=True)
class GetPortfolios(Resource):
    @portfolio.response(200, 'Success', portfolios_response_model)
    @portfolio.response(400, 'Invalid token')
    def get(self):
        """
        Retrieve a list of portfolios and their details that have been created by the current user.
        """
        token = request.args.get("token")

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Retrieve list of portfolio details
        return {
            "portfolios": db.all_portfolios_from_user(user["username"])
        }

@portfolio.route('/summary', doc={
    "description": "Retrieve a summary of all the user's portfolios"
})
class Summary(Resource):
    def post(self):
        """
        [Unfinished] Returns a summary of all the user's portfolio data combined together. 
        """
        return {
            "key": "value"
        }

@portfolio.route('/create', doc={
    "description": "Create a portfolio on the user's account."
})
class CreatePortfolio(Resource):
    
    @portfolio.expect(create_portfolio_model)
    @portfolio.response(200, 'Success', portfolio_id_model)
    @portfolio.response(400, 'Invalid token')
    def post(self):
        """
        Create and link a portfolio to the user's account via the portfolio_id.
        """
        body = request.json
        portfolio_name = body['portfolio_name']
        token = body['token']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Create the portfolio
        portfolio_id = db.add_portfolio(user["username"], portfolio_name)

        # Return the user's portfolio_id for their portfolio.
        return {
            "portfolio_id": portfolio_id
        }

@portfolio.route('/delete', doc={
    "description": "Given the portfolio_id, delete's this portfolio and all it's holdings."
})
class DeletePortfolio(Resource):
    @portfolio.expect(delete_portfolio_model)
    @portfolio.response(200, 'Success', success_model)
    @portfolio.response(400, 'Invalid token')
    def delete(self):
        """
        Delete's specified portfolio and all it's holdings.
        """
        body = request.json
        token = body['token']
        portfolio_id = body['portfolio_id']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user owns the portfolio corresponding to the portfolio_id.
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or portfolio["owner"] != user["username"]:
            abort(400, "User does not own portfolio")

        # Delete the portfolio and all it's holdings.
        db.remove_portfolio(portfolio_id)    

        return {
            "is_success": True
        }

@portfolio.route('/edit', doc={
    "description": "Edit the portfolio's name, details/notes and other customisable stuff that may want to be updated."
})
class EditPortfolio(Resource):
    @portfolio.expect(edit_portfolio_model)
    @portfolio.response(200, 'Success', success_model)
    @portfolio.response(400, 'Invalid token')
    def post(self):
        """
        Edit portfolio details.
        """
        body = request.json
        token = body['token']
        portfolio_name = body['portfolio_name']
        portfolio_id = body['portfolio_id']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user owns the portfolio corresponding to the portfolio_id.
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or portfolio["owner"] != user["username"]:
            abort(400, "User does not own portfolio")

        # Update the portfolio details.
        db.update_portfolio(portfolio_id, portfolio_name)

        return {
            "is_success": True
        }

@portfolio.route('/holdings', doc={
    "description": "View a list of holdings that is in a portfolio, given the portfolio_id."
})
class GetHoldings(Resource):
    @portfolio.expect(get_holdings_model)
    @portfolio.response(200, 'Success', holdings_response_model)
    @portfolio.response(400, 'Invalid token')
    def post(self):
        """
        Retrieve holdings from portfolio.
        """
        body = request.json
        token = body['token']
        portfolio_id = body['portfolio_id']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user owns the portfolio corresponding to the portfolio_id.
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or portfolio["owner"] != user["username"]:
            abort(400, "User does not own portfolio")

        # Retrieve list of holdings from portfolio.
        holdings = db.get_holdings(portfolio_id)

        return holdings

@portfolio.route('/holdings/add', doc={
    "description": "Given the portfolio_id, add a stock and it's relevant details to the portfolio (qty, price, date, type etc)."
})
class AddHoldings(Resource):
    @portfolio.expect(add_stock_model)
    @portfolio.response(200, 'Success', success_model)
    def post(self):
        """
        Add a holding to the portfolio.
        """
        body = request.json
        portfolio_id = body['portfolio_id']
        symbol = body['symbol']
        value = body['value']
        qty = body['qty']
        type = body['type']
        brokerage = body['brokerage']
        exchange = body['exchange']
        date = body['date']
        currency = body['currency']
        token = body['token']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user owns the portfolio corresponding to the portfolio_id.
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or portfolio["owner"] != user["username"]:
            abort(400, "User does not own portfolio")

        # Check that the type is either buy or sell.
        if type not in ['buy', 'sell']:
            abort(400, "Type is invalid")

        # Add stock to portfolio.
        db.add_stock(portfolio_id, symbol, value, qty, type, brokerage, exchange, date, currency)

        return {
            "is_success": True
        }

@portfolio.route('/holdings/edit', doc={
    "description": "Given a holding_id, allows the user to edit details relating to that holding, such as qty, price, date"
})
class EditHoldings(Resource):
    @portfolio.expect(edit_stock_model)
    @portfolio.response(200, 'Success', success_model)
    @portfolio.response(400, 'Invalid token')
    def post(self):
        """
        Edit holding details.
        """
        body = request.json
        token = body['token']
        holding_id = body['holding_id']
        
        holding_details = body
        holding_details.pop('token')
        holding_details.pop('holding_id')

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user owns the holding.
        owner = db.get_owner_from_holding(holding_id)
        if owner is None or owner[0] != user['username']:
            abort(400, "User cannot access this holding.")

        # Update holding details.
        db.update_holding(holding_id, holding_details)

        return {
            "is_success": True
        }

@portfolio.route('/holdings/delete', doc={
    "description": "Removes a holding completly from the portfolio. It's as if the holding was never there."
})
class DeleteHoldings(Resource):
    @portfolio.expect(delete_holding_model)
    def delete(self):
        """
        Deletes a holding from the portfolio.
        """
        body = request.json
        holding_id = body['holding_id']
        token = body['token']

        # Get username from token
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user owns the holding.
        owner = db.get_owner_from_holding(holding_id)
        if owner is None or owner[0] != user['username']:
            abort(400, "User cannot access this holding.")

        # Delete the holding.
        db.remove_holding(holding_id)

        return {
            "is_success": True
        }

@portfolio.route('/download', doc={
    "description": "Allows the user to download a csv of the data given the portfolio_id."
})
@portfolio.param('token', description="The user's token", type=str, required=True)
@portfolio.param('portfolio_id', description="The portfolio_id of the portfolio to download", type=str, required=True)
class DownloadHoldings(Resource):
    def get(self):
        """
        Download holdings as a csv.
        """
        token = request.args.get('token')
        portfolio_id = request.args.get('portfolio_id')

        # Check that token is valid.
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Check that user owns the portfolio.
        portfolio = db.query_portfolio(portfolio_id)
        if portfolio is None or portfolio["owner"] != user["username"]:
            abort(400, "User does not own portfolio")

        # Get the holdings.
        holdings = db.get_holdings(portfolio_id)

        # Query the name of the portfolio from the portfolio_id.
        portfolio_name = db.query_portfolio(portfolio_id)["portfolio_name"]

        # Convert holdings to csv using holdings_to_csv_string helper function.
        csv_string = holdings_to_csv_string(holdings)

        # Returns the csv string as a csv mimetype with headers.
        return Response(csv_string, mimetype='text/csv', headers={'Content-Disposition': f'attachment;filename={portfolio_name}.csv'})

@portfolio.route('/upload', doc={
    "description": "Allows the user to upload a csv of their current holdings. This creates a new portfolio."
})
class UploadHoldings(Resource):
    @portfolio.expect(upload_csv_model)
    @portfolio.response(200, 'Success', portfolio_id_model)
    def post(self):
        """
        Create a portfolio and populate it with holdings from a csv. Note that the frontend will have to send the csv as a string, including headers.
        Currently only works for csv files with the following headers: symbol, qty, price, date, type, brokerage, exchange, currency. This means that
        it currently will only work with the csv files that we generate.
        """
        body = request.json
        token = body['token']
        portfolio_name = body['portfolio_name']
        csv_string = body['csv_string']

        # Check that token is valid.
        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")

        # Create portfolio.
        portfolio_id = db.add_portfolio(user["username"], portfolio_name)

        # Parse csv string into holdings.
        holdings = csv_string_to_holdings(csv_string)

        # Add holdings to portfolio.
        for holding in holdings:
            db.add_stock(portfolio_id, holding["symbol"], holding["value"], holding["qty"], holding["type"], holding["brokerage"], holding["exchange"], holding["date"], holding["currency"])

        return {
            "portfolio_id": portfolio_id
        }
