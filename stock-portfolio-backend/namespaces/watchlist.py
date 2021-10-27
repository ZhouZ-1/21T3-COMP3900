from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import watchlist_info_model, watchlist_request_model, watchlist_add_stock_model, watchlist_delete_stock_model, success_model
from util.alpha_vantage_feed import dc

from ast import literal_eval
import json

watchlist = api.namespace('watchlist', description='Watchlist management: Add, remove stocks, retrieve watched stocks')

@watchlist.route('/', doc={
    "description": "Allows user to get their watchlist"
})
class Watchlist(Resource):
    @watchlist.expect(watchlist_request_model)
    @watchlist.response(200, 'Success', watchlist_info_model)
    @watchlist.response(400, 'Invalid Token!')
    def get(self):
        """
        Function that takes a stock returns the overview details of a particular stock
        """
        body = request.json
        token = body['token']

        user = db.get_user_by_value("active_token", token)
        if not user:
            abort(400, "Token is invalid")
        return {
            "watchList": literal_eval(user["watchlist"])
        }

@watchlist.route('/add', doc={
    "description": "Allows user to add a stock to their watchlist"
})
class WatchlistAddStocks(Resource):
    @watchlist.expect(watchlist_add_stock_model)
    @watchlist.response(200, 'Success', success_model)
    @watchlist.response(409, 'Invalid Token!')
    @watchlist.response(400, 'AAPL already exists in the watch list')
    def post(self):
        """
        Function that takes a stock returns the overview details of a particular stock
        """
        body = request.json
        token = body['token']
        symbol = body['symbol']
        stock_name = body['stock_name']

        # validity checks
        # make sure it is a string
        if not isinstance(username, str):
            abort(409, f"{username} is not a string")

        user = db.get_user_by_value("active_token", token)

        if not user:
            abort(400, "Token is invalid")
        
        new_pair = [symbol,stock_name]
        user["watchlist"] = literal_eval(user["watchlist"])
        if new_pair not in user["watchlist"]:
            user["watchlist"].append(new_pair)
            db.update_user_by_value(user, "watchlist", json.dumps(user["watchlist"]))
        else:
            abort(409, f"{stock} already exists in the watch list")
        
        return {
            "is_success": "true"
        }
@watchlist.route('/delete', doc={
    "description": "Allows user to delete stocks from their watchlist"
})
class WatchlistDeleteStocks(Resource):
    @watchlist.expect(watchlist_delete_stock_model)
    @watchlist.response(200, 'Success', success_model)
    @watchlist.response(409, 'Unable to process request')
    def delete(self):
        """
        Function that takes a stock returns the overview details of a particular stock
        """
        body = request.json
        username = body['username']
        stocks_to_delete = body['stocks']

        # validity checks
        # make sure it is a string
        if not isinstance(username, str):
            abort(409, "Unable to process request")

        user = db.get_user_by_value('username', username)

        if not user:
            abort(410, "Could not find user")

        user["watchlist"] = literal_eval(user["watchlist"])
        new_stocks = [x for x in user["watchlist"] if x not in stocks_to_delete]

        db.update_user_by_value(username, "watchlist", json.dumps(new_stocks))
        
        return { 
            "is_success": "true"
        }