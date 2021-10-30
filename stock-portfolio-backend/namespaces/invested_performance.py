from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import watchlist_info_model, watchlist_request_model, watchlist_stock_model
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

        past_data = dc.ts.get_daily(symbol="GOOG", outputsize="full")
        print(past_data)