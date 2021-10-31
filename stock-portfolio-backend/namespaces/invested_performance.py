from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import watchlist_info_model, watchlist_request_model, watchlist_stock_model, portfolio_performance_model, portfolio_performance_response_model
from util.database import *
from util.alpha_vantage_feed import dc

import json

invested_performance = api.namespace('invested_performance', description='Stats on performance of overall invested stocks')

@invested_performance.route('/', doc={
    "description": "Allows user to retrieve their performance stats"
})
class GetInvestedPerformance(Resource):
    def get(self):
        """
        Returns a JSON object containing the performance stats of the user's invested stocks
        """

        username = request.args.get("username")

        # Find user
        user = get_user_by_value("username", username)
        # Get the user's invested stocks
        all_portfolios = all_portfolios_from_user(username)
        all_portfolio_ids = [portfolio.id for portfolio in all_portfolios]

        # Get all of user's holdings
        all_holdings = [get_holdings(portfolio.id) for portfolio in all_portfolios]

        # Remove duplicates
        all_holdings = list(dict.fromkeys(all_holdings))

        return {
            'test': all_holdings,
        }

@invested_performance.route('/portfolio', doc={
    "description": "Allows user to retrieve their performance stats for a particular portfolio"
})
class GetPortfolioPerformance(Resource):
    @invested_performance.expect(portfolio_performance_model)
    @invested_performance.response(200, 'Success', portfolio_performance_response_model)
    def get(self):
        """
        Returns a JSON object containing the performance stats of the user's invested stocks
        """
        body = request.json
        portfolio_id = body['portfolio']
    
        # Get holdings for the particular portfolio
        portfolio_holdings = get_holdings(portfolio_id)

        perf_results ={}
        orig_overall = 0
        curr_overall = 0

        # for each holding calculate the change in price
        for holding in portfolio_holdings:
            # find out the most recent price of the stock
            ts_data = dc.ts.get_quote_endpoint(holding['symbol'])[0]
            curr_price = ts_data["05. price"]

            delta = float(curr_price) - holding['price']

            perf_results[holding['symbol']] = {
                'orig_price': holding['price'],
                'curr_price': holding['price'],
                'change_val': delta * holding['qty'],
                'change-percent': delta / holding['price'],
            }

            orig_overall += holding['price'] * holding['qty']
            curr_overall += curr_price * holding['qty']

        # calculate overall change
        overall_delta = curr_overall - orig_overall
        
        perf_results['overall'] = {
            'orig_price': orig_overall,
            'curr_price': curr_overall,
            'change_val': overall_delta,
            'change-percent': overall_delta / orig_overall,
        }

        return perf_results