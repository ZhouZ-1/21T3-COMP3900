from flask import request
from flask_restplus import Resource, abort
from app import api, db
from util.models import watchlist_info_model, watchlist_request_model, watchlist_stock_model, watchlist_delete_stock_model, success_model
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
    @watchlist.response(409, 'Unable to process request')
    def post(self):
        """
        Function that takes a stock returns the overview details of a particular stock
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
            db.update_user_by_value(username, "watchlist", json.dumps([]))
        
        if user["watchlist"] == None or user["watchlist"] == "null":
            db.update_user_by_value(username, "watchlist", json.dumps([]))
            return {"watchlist": []}

        # add more fields depending on what information we want
        return { 
            "watchlist": literal_eval(user["watchlist"])
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
        Function that takes a stock returns the overview details of a particular stock
        """
        body = request.json
        username = body['username']
        stock = body['stock']

        # validity checks
        # make sure it is a string
        if not isinstance(username, str):
            abort(409, f"{username} is not a string")

        user = db.get_user_by_value('username', username)

        if not user:
            abort(410, "Could not find user")

        if "watchlist" not in user.keys():
            print("YOOOO")
            user["watchlist"] = []
            db.update_user_by_value(username, "watchlist", [])

        if user["watchlist"] == None or user["watchlist"] == "null":
            user["watchlist"] = '[]'

        # add more fields depending on what information we want
        user["watchlist"] = literal_eval(user["watchlist"])

        # check if stock is already in watchlist
        if stock in user["watchlist"]:
            abort(409, f"{stock} is already in your watchlist")

        user["watchlist"].append(stock)
        db.update_user_by_value(username, "watchlist", json.dumps(user["watchlist"]))

        return { 
            "watchlist": user["watchlist"]
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