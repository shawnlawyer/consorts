from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from pusher import Pusher
import logging
from logging import Formatter, FileHandler
import babel
import dateutil.parser
import random

from .config import Config, basedir

app = Flask(__name__, '/api')
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db, directory=app.config.get('MIGRATIONS_PATH'))
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
pusher = Pusher(**app.config.get('PUSHER_SETTINGS'))

from .blueprints import *

app.register_blueprint(core, url_prefix='/api')
app.register_blueprint(agent, url_prefix='/api')
app.register_blueprint(module, url_prefix='/api')
app.register_blueprint(intent, url_prefix='/api')
app.register_blueprint(intent_pattern, url_prefix='/api')
app.register_blueprint(intent_response, url_prefix='/api')
app.register_blueprint(lexicon, url_prefix='/api')


@app.before_first_request
def before_first_request_func():

    pass


@app.before_request
def before_request():

    pass


@app.after_request
def after_request(response):

    response.headers.add(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization,true'
    )
    response.headers.add(
        'Access-Control-Allow-Methods',
        'GET,PATCH,POST,DELETE,OPTIONS'
    )

    return response


@app.teardown_request
def teardown_request(error=None):

    db.session.close()


@app.errorhandler(404)
def not_found(error):
    '''
    Error handler for expected error 404.
    '''

    return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found",
    }), 404


@app.errorhandler(405)
def method_not_allowed(error):
    '''
    Error handler for expected error 405.
    '''

    return jsonify({
        "success": False,
        "error": 405,
        "message": "method not allowed",
    }), 405


@app.errorhandler(413)
def too_large(error):
    '''
    Error handler for expected error 413.
    '''

    return jsonify({
        "success": False,
        "error": 413,
        "message": "file to large",
    }), 413

@app.errorhandler(422)
def unprocessable(error):
    '''
    Error handler for expected error 422.
    '''

    return jsonify({
        "success": False,
        "error": 422,
        "message": "unprocessable",
    }), 422


@app.errorhandler(500)
def server_error(error):
    '''
    Error handler for expected error 500.
    '''

    return jsonify({
        "success": False,
        "error": 500,
        "message": "server error",
    }), 500
