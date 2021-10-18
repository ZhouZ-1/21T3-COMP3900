from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import search_model,  stock_info_model, simple_stock_info_model
from util.alpha_vantage_feed import dc

stocks = api.namespace('stocks', description='Stock Information')

@stocks.route('/search', doc={
    "description": "Allows the user to search for a specific stock"
})
class Search(Resource):
    @stocks.expect(search_model)
    @stocks.response(200, 'Success',  stock_info_model)
    @stocks.response(409, 'No matches found')
    def post(self):
        """
        Function that takes a symbol returns the overview details of a particular stock
        """
        body = request.json
        inst_symbol = body['symbol']

        # validity checks
        # make sure it is a string
        if not isinstance(inst_symbol, str):
            abort(409, f"{inst_symbol} is not a string")
            
        try:
            # get current stock data
            raw_data = dc.fd.get_company_overview(inst_symbol)[0]
            ts_data = dc.ts.get_quote_endpoint(inst_symbol)[0]
            ts_intraday = dc.ts.get_intraday(inst_symbol, interval='5min')[0]


        except ValueError:
            # case when stock cannot be found during the api call
            abort(409, "No matches found for the symbol")

        # add more fields depending on what information we want
        return { 
            "symbol": raw_data["Symbol"],
            "asset_type": raw_data["AssetType"],
            "name": raw_data["Name"],
            "description": raw_data["Description"],
            "sector": raw_data["Sector"],
            "industry": raw_data["Industry"],
            "price": ts_data["05. price"],
            "year_high": raw_data["52WeekHigh"],
            "year_low": raw_data["52WeekLow"],
            "open": ts_data["02. open"],
            "high": ts_data["03. high"],
            "low": ts_data["04. low"],
            "volume": ts_data["06. volume"],
            "latest_trading_day": ts_data["07. latest trading day"],
            "previous_close": ts_data["08. previous close"],
            "change": ts_data["09. change"],
            "change_percent": ts_data["10. change percent"],
            "intraday": ts_intraday
        }

@stocks.route('', doc={
    "description": "Backup search results incase we want to search a query asynchronously."
})
@stocks.param('offset', description="How many results you want to skip.", type=int, default=0)
@stocks.param('limit', description="The maximum number of results you want to return", type=int, default=10)
@stocks.param('query', description="The search query you want to compare the stocks to", type=str, required=True)
class SearchPaginated(Resource):
    @stocks.response(200, 'Success', [simple_stock_info_model])
    def get(self):
        """
        We can remove this later if it ends up not being used.
        """
        # Parse query string parameters
        query = request.args.get("query")

        offset = request.args.get("offset")
        offset = int(offset) if offset is not None and int(offset) >= 0 else 0
        
        limit = request.args.get("limit")
        limit = int(limit) if limit is not None and int(limit) > 0 else 10

        # Search database and return results
        return db.query_stocks(query, limit, offset)

@stocks.route('/searchall', doc={
    "description": "Allows the user to view all stocks"
})
class SearchAll(Resource):
    def post(self):
        # reset iterator
        db.s_iterator.reset_max()
        db.s_iterator.reset_page_num()

        results = db.s_iterator.next()
        return {
            "pg_num": db.s_iterator.page_num,
            "body": results
        }

@stocks.route('/searchnext', doc={
    "description": "Allows the user to view the next batch stocks"
})
class SearchNext(Resource):
    def post(self):
        results = db.s_iterator.next()
        return {
            "pg_num": db.s_iterator.page_num,
            "body": results
        }

@stocks.route('/searchprev', doc={
    "description": "Allows the user to view the previous batch stocks"
})
class SearchPrev(Resource):
    def post(self):
        results = db.s_iterator.back()
        return {
            "pg_num": db.s_iterator.page_num,
            "body": results
        }