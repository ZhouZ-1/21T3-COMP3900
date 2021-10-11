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
            "price": raw_data["AnalystTargetPrice"]
        }

@stocks.route('/searchall', doc={
    "description": "Allows the user to view all stocks"
})
class SearchAll(Resource):
    def post(self):

        return {
            "pg_num": db.s_iterator.offset,
            "body": db.s_iterator.next()
        }