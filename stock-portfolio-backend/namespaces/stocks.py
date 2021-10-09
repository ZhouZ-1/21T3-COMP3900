# needs pip install alpha_vantage (add to dependencies)
from alpha_vantage.fundamentaldata import FundamentalData
from alpha_vantage.timeseries import TimeSeries
from app import db
from enum import Enum

import requests
import csv

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
        
    def get_stock_overview(self, inst_symbol) -> dict:
        """
        Function that takes a symbol returns the overview details of a particular stock
        
        input: symbol (str)
        output: stock data (dictionary)
        """

        # validity checks
        # make sure it is a string
        if not isinstance(inst_symbol, str):
            return {}
           
        try:
            raw_data = self.fd.get_company_overview(inst_symbol)[0]
        except ValueError:
            # case when stock cannot be found during the api call
            print("Invalid stock symbol")
            return {}


        # add in time series for performance tracking

        # add more fields depending on what information we want
        return { "symbol": raw_data["Symbol"],
                    "asset_type": raw_data["AssetType"],
                    "name": raw_data["Name"],
                    "description": raw_data["Description"],
                    "sector": raw_data["Sector"],
                    "industry": raw_data["Industry"],
                    "price": raw_data["AnalystTargetPrice"] }

    def refresh_stock_list(self):
        """
        Update database with currently active stock listings
        """
        # check if database is empty

        
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

if __name__ == "__main__":
    test = DataCollector()
    print(test.get_stock_overview("IBM"))