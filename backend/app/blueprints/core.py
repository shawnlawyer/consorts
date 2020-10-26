from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from ..controllers import core as CoreController

blueprint = Blueprint('core', __name__)
controller = CoreController


@blueprint.route('/')
def index_page():

    return controller.index_page()
