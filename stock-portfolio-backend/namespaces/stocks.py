from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import search_model
from util.alpha_vantage_feed import dc

stocks = api.namespace('stocks', description='Stock Information')

@stocks.route('/search', doc={
    "description": "Allows the user to search for a specific stock"
})
class Search(Resource):
    @stocks.expect(search_model)
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
            return {}
            
        try:
            raw_data = dc.fd.get_company_overview(inst_symbol)[0]
        except ValueError:
            # case when stock cannot be found during the api call
            abort(409, "No matches found for the symbol")
            return {}

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
            "52_week_high": raw_data["52WeekHigh"],
            "52_week_low": raw_data["52WeekLow"]
        }

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