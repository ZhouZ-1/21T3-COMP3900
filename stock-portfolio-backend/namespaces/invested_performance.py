from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import portfolio_performance_model, portfolio_performance_response_model
from util.database import *
from util.alpha_vantage_feed import dc
import csv
import requests
import datetime

import json

invested_performance = api.namespace('invested_performance', description='Stats on performance of overall invested stocks')

@invested_performance.route('/', doc={
    "description": "Allows user to retrieve their performance stats across all portfolios"
})
@invested_performance.param('token', description="The user's token", type=str, required=True)
class GetInvestedPerformance(Resource):
    def get(self):
        """
        Returns a JSON object containing the performance stats of the user's invested stocks from time of adding to portfolio
        """

        token = request.args.get("token")

        # Find user
        user = get_user_by_value("active_token", token)
        # Get the user's invested stocks
        all_portfolios = all_portfolios_from_user(user['username'])

        # Get all of user's holdings
        all_holdings = []
        for portfolio in all_portfolios:
            holdings = get_holdings(portfolio['portfolio_id'])

            for holding in holdings:
                if holding not in all_holdings:
                    all_holdings.append(holding)

        total_gains = 0
        pct_performance = 0
        curr_price = 0
        old_price = 0

        for holding in all_holdings:
            print(holding)
            # Get the current price of the stock
            curr_price += float(dc.ts.get_quote_endpoint(holding['symbol'])[0]['05. price'])

            # Get the old price of the stock
            old_price += holding['value']

            # Calculate the performance of the stock
            pct_performance = (curr_price - old_price) / old_price
            total_gains += (curr_price - old_price) * holding['qty']

        return {
            'total_gains': total_gains,
            'pct_performance': pct_performance,
        }

@invested_performance.route('/portfolio', doc={
    "description": "Allows user to retrieve their performance stats for a particular portfolio"
})
@invested_performance.param('portfolio', description="Portfolio ID", type=str, required=True)
class GetPortfolioPerformance(Resource):
    @invested_performance.response(200, 'Success', portfolio_performance_response_model)
    def get(self):
        """
        Returns a JSON object containing the performance stats of the user's invested stocks
        """
        portfolio_id = request.args.get('portfolio')

        # Get holdings for the particular portfolio
        portfolio_holdings = get_holdings(portfolio_id)

        perf_calcs = {}
        perf_results = []
        orig_overall = 0
        curr_overall = 0

        # for each holding calculate the change in price
        if len(portfolio_holdings) != 0:
            for holding in portfolio_holdings:
                # find out the most recent price of the stock
                ts_data = dc.ts.get_quote_endpoint(holding['symbol'])[0]
                curr_price = float(ts_data["05. price"])

                delta = curr_price - holding['value']

                holding_product = holding['value'] * holding['qty']
                curr_product = curr_price * holding['qty']

                if holding['symbol'] in perf_calcs:
                    perf_calcs[holding['symbol']]['orig_price'] += holding_product
                    perf_calcs[holding['symbol']]['curr_price'] += curr_product
                else:
                    perf_calcs[holding['symbol']] = {}
                    perf_calcs[holding['symbol']]['orig_price'] = holding_product
                    perf_calcs[holding['symbol']]['curr_price'] = curr_product

                orig_overall += holding_product
                curr_overall += curr_product

            for key in perf_calcs:
                delta = perf_calcs[key]['curr_price'] - perf_calcs[key]['orig_price']
                perf_results.append({
                    'symbol': key,
                    'orig_price': perf_calcs[key]['orig_price'],
                    'curr_price': perf_calcs[key]['curr_price'],
                    'change_val': delta,
                    'change_percent': delta / perf_calcs[key]['orig_price'],
                })

            # calculate overall change
            overall_delta = curr_overall - orig_overall

            perf_results.append({
                'symbol': 'overall',
                'orig_price': orig_overall,
                'curr_price': curr_overall,
                'change_val': overall_delta,
                'change_percent': overall_delta / orig_overall,
            })

        return {
            'symbols': perf_results
        }


@invested_performance.route('/tax', doc={
    "description": "Allows user to see how much Capital Gain Tax they have to pay"
})
@invested_performance.param('token', description="The user's token", type=str, required=True)
class GetCapitalGainTax(Resource):
    def get(self):
        """
        Returns a JSON object containing the amount of Capital Gain Tax the user has to pay
        """
        token = request.args.get("token")

        # Find user
        user = get_user_by_value("active_token", token)
        # Get the user's invested stocks
        all_portfolios = all_portfolios_from_user(user['username'])

        # Get all of user's holdings
        all_holdings = []
        for portfolio in all_portfolios:
            holdings = get_holdings(portfolio['portfolio_id'])

            for holding in holdings:
                if holding not in all_holdings:
                    all_holdings.append(holding)

        total_gains = 0
        curr_price = 0
        old_price = 0

        for holding in all_holdings:
            # Get the price of the stock a year ago
            CSV_URL = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol={holding["symbol"]}&interval=15min&slice=year2month1&apikey=FVR0K5XNNUQA3HXT'

            with requests.Session() as s:
                download = s.get(CSV_URL)
                decoded_content = download.content.decode('utf-8')
                cr = csv.reader(decoded_content.splitlines(), delimiter=',')
                my_list = list(cr)
                for row in my_list:
                    one_year = (datetime.datetime.today() - datetime.timedelta(days=365))
                    # if saturday, subtract 1 day
                    if one_year.weekday() == 5:
                        one_year -= datetime.timedelta(days=1)
                    # if sunday, subtract 2 days
                    if one_year.weekday() == 6:
                        one_year -= datetime.timedelta(days=2)

                    if row[0].split(" ")[0] == one_year.strftime("%Y-%m-%d"):
                        last_year_holding = row
                        break

            curr_price += float(last_year_holding[4])

            # Get the old price of the stock
            old_price += holding['value']

            # Calculate the performance of the stock
            total_gains += (curr_price - old_price) * holding['qty']
            to_declare = 0
            if total_gains < 0:
                to_declare = -total_gains

        return {
            'yearly_gain': total_gains,
            'to_declare': to_declare,
            'CGT': to_declare / 2,
        }