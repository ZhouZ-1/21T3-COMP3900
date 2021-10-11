# needs pip install alpha_vantage (add to dependencies)
from alpha_vantage.fundamentaldata import FundamentalData
from alpha_vantage.timeseries import TimeSeries
from enum import Enum

from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import search_model

import requests
import csv

stocks = api.namespace('stocks', description='Stock Information')

ALPHAVANTAGE_API_KEY = "FVR0K5XNNUQA3HXT"

class Col(Enum):
    symbol = 0
    name = 1
    exchange = 2
    asset_type = 3

class DataCollector:
    def __init__(self):
        self.fd = FundamentalData(ALPHAVANTAGE_API_KEY, output_format = 'json')
        self.ts = TimeSeries(ALPHAVANTAGE_API_KEY, output_format = 'json')
        
        self.refresh_stock_list()

    def refresh_stock_list(self):
        """
        Update database with currently active stock listings
        """        
        # get listings
        csv_url = 'https://www.alphavantage.co/query?function=LISTING_STATUS&state=active&apikey=' + ALPHAVANTAGE_API_KEY

        with requests.Session() as session:
            dl = session.get(csv_url)
            decoded_data = dl.content.decode("utf-8")
            csv_data = csv.reader(decoded_data.splitlines(), delimiter=',')
            stock_listing = list(csv_data)

            i = 0
            for stock in stock_listing:
                if i == 0:
                    # skip header
                    i += 1
                    continue

                db.update_stock_listing(stock[Col.symbol.value],
                    stock[Col.name.value], stock[Col.exchange.value], stock[Col.asset_type.value])

        #update search iterator

dc = DataCollector()
    
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