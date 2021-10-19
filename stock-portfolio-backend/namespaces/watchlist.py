from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import watchlist_info_model, watchlist_request_model, watchlist_stock_model
from util.alpha_vantage_feed import dc

watchlist = api.namespace('watchlist', description='Watchlist management: Add, remove stocks, retrieve watched stocks')

@watchlist.route('/', doc={
    "description": "Allows user to get their watchlist"
})
class Watchlist(Resource):
    @watchlist.expect(watchlist_request_model)
    @watchlist.response(200, 'Success', watchlist_info_model)
    @watchlist.response(409, 'Unable to process request')
    def get(self):
        """
        Function that takes a symbol returns the overview details of a particular stock
        """
        body = request.json
        username = body['username']

        # validity checks
        # make sure it is a string
        if not isinstance(username, str):
            abort(409, f"{username} is not a string")

        user = db.get_user_by_value('username', username)

        if not user:
            abort(410, "Could not find user")

        # if current user does not have a watchlist, create one
        if "watchlist" not in user.keys():
            user["watchlist"] = []
            db.update_user_by_value(username, "watchlist", [])

        # add more fields depending on what information we want
        return { 
            "watchlist": user["watchlist"]
        }

@watchlist.route('/add', doc={
    "description": "Allows user to add a stock to their watchlist"
})
class WatchlistAddStocks(Resource):
    @watchlist.expect(watchlist_stock_model)
    @watchlist.response(200, 'Success', watchlist_info_model)
    @watchlist.response(409, 'Unable to process request')
    def post(self):
        """
        Function that takes a symbol returns the overview details of a particular stock
        """
        body = request.json
        username = body['username']
        symbol = body['symbol']

        # validity checks
        # make sure it is a string
        if not isinstance(username, str):
            abort(409, f"{username} is not a string")

        user = db.get_user_by_value('username', username)

        if not user:
            abort(410, "Could not find user")

        if "watchlist" not in user.keys():
            user["watchlist"] = []
            db.update_user_by_value(username, "watchlist", [])

        # add more fields depending on what information we want
        user["watchlist"].append(symbol)
        db.update_user_by_value(username, "watchlist", user["watchlist"])

        return { 
            "watchlist": user["watchlist"]
        }