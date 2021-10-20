from flask import request
from flask_restplus import Resource, abort
from app import api, db
from datetime import datetime, timedelta
from util.models import search_model, search_past_model, stock_info_model, simple_stock_info_model
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
            raw_data = dc.fd.get_company_overview(inst_symbol)[0]
        except ValueError:
            # case when stock cannot be found during the api call
            abort(409, "No matches found for the symbol")

        # add in time series for performance tracking

        # add more fields depending on what information we want
        return { 
            "symbol": raw_data["Symbol"],
            "asset_type": raw_data["AssetType"],
            "name": raw_data["Name"],
            "description": raw_data["Description"],
            "sector": raw_data["Sector"],
            "industry": raw_data["Industry"],
            "price": raw_data["AnalystTargetPrice"],
            "year_high": raw_data["52WeekHigh"],
            "year_low": raw_data["52WeekLow"]
        }

@stocks.route('/searchpast', doc={
    "description": "Allows the user to search for a stocks"
})
class SearchPast(Resource):
    @stocks.expect(search_past_model)
    def post(self):
        """
        Function that takes historical data up to a specified date before the current date
        """
        body = request.json
        inst_symbol = body['symbol']
        date_before = body['date_before']

        # validity checks
        # make sure it is a string
        if not isinstance(inst_symbol, str):
            abort(409, f"{inst_symbol} is not a string")
        try:
            raw_data = dc.ts.get_daily(symbol=inst_symbol, outputsize='full')[0]
        except ValueError:
            # case when stock cannot be found during the api call
            abort(409, "No matches found for the symbol")

        txt_split = date_before.split()
        mod_num = int(txt_split[0])
        mod_type = txt_split[1] 

        if mod_type == "weeks":
            mod_num *= 7
        elif mod_type == "months":
            mod_num *= 4 * 7

        now = datetime.now()
        target_date = now - timedelta(days=mod_num)
        filtered_dates = dict(filter(lambda row: datetime.strptime(row[0], '%Y-%m-%d') >= target_date , raw_data.items()))
        
        return filtered_dates
        
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