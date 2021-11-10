from flask_restplus import fields
from app import api

login_model = api.model('login_model', {
    "username": fields.String(required=True, example="johnsmith"),
    "password": fields.String(required=True, example="hunter22"),
})

register_model = api.inherit('register_model', login_model, {
    "first_name": fields.String(required=True, example="john"),
    "last_name": fields.String(required=True, example="smith"),
    "email": fields.String(required=True, example="john@email.com")
})

token_model = api.model('token_model', {
    'token': fields.String(required=True)
})

change_password_model = api.inherit('change_password_model', token_model, {
    "old_password": fields.String(required=True),
    "new_password": fields.String(required=True)
})

recover_model = api.inherit('recover_model', {
    "email": fields.String(required=True, example="john@email.com")
})

success_model = api.model('success_model', {
    "is_success": fields.Boolean()
})

search_model = api.model('search_model', {
    "symbol": fields.String(required=True, example="GOOG")
})

search_past_model = api.model('search_past_model', {
    "symbol": fields.String(required=True, example="GOOG"),
    "date_before": fields.String(required=True, example="3 months")
})

simple_stock_info_model = api.model('simple_stock_info_model', {
    "symbol": fields.String(required=True, example="GOOG"),
    "name": fields.String(required=True, example="Alphabet Inc - Class C"),
    "exchange": fields.String(required=True, example="NASDAQ"),
    "asset_type": fields.String(required=True, example="Stock")
})

stock_info_model = api.model('stock_info_model', {
    "symbol": fields.String(required=True, example="GOOG"),
    "asset_type": fields.String(required=True, example="Common Stock"),
    "name": fields.String(required=True, example="Alphabet Inc"),
    "description": fields.String(required=True, example="Alphabet Inc. is an American multinational conglomerate headquartered in Mountain View, California. It was created through a restructuring of Google on October 2, 2015, and became the parent company of Google and several former Google subsidiaries. The two co-founders of Google remained as controlling shareholders, board members, and employees at Alphabet. Alphabet is the world's fourth-largest technology company by revenue and one of the world's most valuable companies."),
    "sector": fields.String(required=True, example="TECHNOLOGY"),
    "industry": fields.String(required=True, example="SERVICES-COMPUTER PROGRAMMING, DATA PROCESSING, ETC."),
    "price": fields.String(required=True, example="3106.11"),
    "year_high": fields.String(required=True, example="2936.41"),
    "year_low": fields.String(required=True, example="1514.62")
})

details_model = api.model('details_model', {
    "username": fields.String(required=True, example="user100"),
    "first_name": fields.String(required=True, example="john"),
    "last_name": fields.String(required=True, example="smith"),
    "email": fields.String(required=True, example="john@email.com"),
    "profile_image": fields.String(required=True, example="http://127.0.0.1:5000/images/default.png")
})

update_details_model = api.inherit('update_details_model', token_model, {
    "field": fields.String(required=True, description="The field to update"),
    "value": fields.String(required=True, description="The value of the field after updating.")
})

image_upload_model = api.inherit('image_upload_model', token_model, {
    'base64': fields.String(required=True, example='data:image/jpeg;base64,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')
})

watchlist_request_model = api.model("watchlist_request_model", {
    "token": fields.String(required=True, example="abcd1234!@#$"),
})


watchlist_info_model = api.model("watchlist_info_model", {
    "stocks": fields.List(fields.String, required=True, example=[["AAPL","Apple Inc"],["TSLA","Tesla"]])
})

watchlist_add_stock_model = api.model("watchlist_add_stock_model", {
    "token": fields.String(required=True, example="abcd1234!@#$"),
    "symbol": fields.String(required=True, example="AAPL"),
    "stock_name": fields.String(required=True, example="Apple Inc"),
})

watchlist_delete_stock_model = api.model("watchlist_delete_stock_model", {
    "token": fields.String(required=True, example="abc123!@#"),
    "stocks": fields.List(fields.String, required=True, example=["AAPL", "MSFT"])
})

create_portfolio_model = api.inherit('create_portfolio_model', token_model, {
    "portfolio_name": fields.String(required=True)
})

portfolio_id_model = api.model('portfolio_id_model', {
    "portfolio_id": fields.Integer(required=True)
})

delete_portfolio_model = api.inherit('delete_portfolio_model', token_model, {
    "portfolio_id": fields.Integer(required=True)
})

edit_portfolio_model = api.inherit('edit_portfolio_model', create_portfolio_model, {
    "portfolio_id": fields.Integer(required=True)
})

add_stock_model = api.inherit('add_stock_model', token_model, {
    "portfolio_id": fields.Integer(required=True, example=1),
    "symbol": fields.String(required=True, example='TSLA'),
    "value": fields.Float(required=True, example=1.1, description='The value of a single stock'),
    "qty": fields.Float(required=True, example=99.9, description='The amount of stock that was bought/sold'),
    "type": fields.String(required=True, example="buy", description="Either 'buy' or 'sell'"),
    "brokerage": fields.Float(required=True, example=9.95, description="The amount of brokerage you paid"),
    "exchange": fields.String(required=True, example='NYSE', description="The name of the exchange that this stock belongs to"),
    "date": fields.String(required=True, example="19/10/21", description="A string in the format dd/mm/yy"),
    "currency": fields.String(required=True, example="USD", description="The currency that is used to buy the stock")
})

basic_portfolio_info = api.model('basic_portfolio_info', {
    "portfolio_id": fields.Integer(required=True, example=1), 
    "portfolio_name": fields.String(required=True, example='My Portfolio')
})

portfolios_response_model = api.model('portfolio_response_model', {
    "portfolios": fields.List(fields.Nested(basic_portfolio_info))
})

delete_holding_model = api.inherit('delete_holding_model', token_model, {
    "holding_id": fields.Integer(required=True, example=1)
})

edit_stock_model = api.inherit('edit_stock_model', delete_holding_model, {
    "symbol": fields.String(example='TSLA'),
    "value": fields.Float(example=1.1, description='The value of a single stock'),
    "qty": fields.Float(example=99.9, description='The amount of stock that was bought/sold'),
    "type": fields.String(example="buy", description="Either 'buy' or 'sell'"),
    "brokerage": fields.Float(example=9.95, description="The amount of brokerage you paid"),
    "exchange": fields.String(example='NYSE', description="The name of the exchange that this stock belongs to"),
    "date": fields.String(example="19/10/21", description="A string in the format dd/mm/yy"),
    "currency": fields.String(example="USD", description="The currency that is used to buy the stock")
})

portfolio_performance_model = api.model("portfolio_performance_model", {
    "portfolio_id": fields.Integer(required=True, example=1),
})

basic_performance_info = api.model('basic_performance_info', {
    'symbol': fields.String(example='TSLA'),
    'orig_price': fields.Float(example=99.9, description='The price of the stock that was originally bought'),
    'curr_price': fields.Float(example=99.9, description='The price of the stock currently'),
    'change_val': fields.Float(example=99.9, description='The change in prices'),
    'change-percent': fields.Float(example=99.9, description='The percentage change')
})

portfolio_performance_response_model = api.model('portfolio_response_model', {
    "symbols": fields.List(fields.Nested(basic_performance_info))
})

upload_csv_model = api.inherit('upload_csv_model', token_model, {
    "csv_string": fields.String(required=True, example="symbol,value,qty,type,brokerage,exchange,date,currency\nAAPL,1.1,99.9,buy,9.95,NYSE,19/10/21,USD\nMSFT,1.1,99.9,buy,9.95,NYSE,19/10/21,USD"),
    "portfolio_name": fields.String(required=True, example="My Portfolio")
})

get_holdings_model = api.inherit('get_holdings_model', token_model, {
    "portfolio_id": fields.Integer(required=True, example=1)
})

basic_holding_info = api.model('basic_holding_info', {
    "holding_id": fields.Integer(required=True, example=1),
    "symbol": fields.String(example='TSLA'),
    "value": fields.Float(example=1.1, description='The value of a single stock'),
    "qty": fields.Float(example=99.9, description='The amount of stock that was bought/sold'),
    "type": fields.String(example="buy", description="Either 'buy' or 'sell'"),
    "brokerage": fields.Float(example=9.95, description="The amount of brokerage you paid"),
    "exchange": fields.String(example='NYSE', description="The name of the exchange that this stock belongs to"),
    "date": fields.String(example="19/10/21", description="A string in the format dd/mm/yy"),
    "currency": fields.String(example="USD", description="The currency that is used to buy the stock")
})

holdings_response_model = api.model('holdings_response_model', {
    "holdings": fields.List(fields.Nested(basic_holding_info))
})

simple_holding_info = api.model('simple_holding_info', {
    "symbol": fields.String(example='TSLA'),
    "qty": fields.Float(example=99.9, description='The amount of stock that was bought/sold'),
    "average_price": fields.Float(example=1.1, description='The average price of the stock'),
})

summary_response_model = api.model('summary_response_model', {
    "summary": fields.List(fields.Nested(simple_holding_info))
})

shared_with_me_model = api.model('shared_with_me_model', {
    "portfolio_id": fields.Integer(required=True, example=1),
    "sharing_id": fields.Integer(required=True, example=1),
    "portfolio_name": fields.String(required=True, example="My Portfolio"),
    "owner": fields.String(required=True, example="John Doe"),
})

sharing_mapping = api.model('sharing_mapping', {
    "username": fields.String(required=True, example="John Doe"),
    "sharing_id": fields.Integer(required=True, example=1),
    "status": fields.String(required=True, example="accepted")
})

sharing_with_others_model = api.model('sharing_with_others_model', {
    "portfolio_id": fields.Integer(required=True, example=1),
    "portfolio_name": fields.String(required=True, example="My Portfolio"),
    "shared_with": fields.List(fields.Nested(sharing_mapping))
})

send_invite_model = api.inherit('send_invite_model', token_model, {
    "username": fields.String(required=True, example="John Doe"),
    "portfolio_id": fields.Integer(required=True, example=1)
})

invite_model = api.model('invite_model', {
    "sharing_id": fields.Integer(required=True, example=1),
    "portfolio_id": fields.Integer(required=True, example=1),
    "portfolio_name": fields.String(required=True, example="My Portfolio"),
    "owner": fields.String(required=True, example="John Doe"),
})

reply_model = api.inherit('reply_model', token_model, {
    "sharing_id": fields.Integer(required=True, example=1),
    "accepted": fields.Boolean(required=True, example=True)
})

revoke_permission_model = api.inherit('revoke_permission_model', token_model, {
    "sharing_id": fields.Integer(required=True, example=1)
})
