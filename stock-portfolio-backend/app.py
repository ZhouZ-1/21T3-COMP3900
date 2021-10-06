from flask import Flask
from flask_restplus import Api
from flask_cors import CORS
from util import database as db

app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)
api = Api(app)
