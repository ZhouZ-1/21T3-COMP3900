from alpha_vantage.fundamentaldata import FundamentalData
from alpha_vantage.timeseries import TimeSeries
import requests
import csv
import util.database as db

ALPHAVANTAGE_API_KEY = "FVR0K5XNNUQA3HXT"

class DataCollector:
    def __init__(self):
        # NOTE: MIGHT TRY USING PANDAS
        self.fd = FundamentalData(ALPHAVANTAGE_API_KEY, output_format = 'json')
        self.ts = TimeSeries(ALPHAVANTAGE_API_KEY, output_format = 'json')

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

            # Update database with stock listings
            for symbol, name, exchange, assetType, *_ in stock_listing[1:]:
                db.update_stock_listing(symbol, name, exchange, assetType)

        #update search iterator

dc = DataCollector()
