from flask import Blueprint, render_template, request, flash, redirect, url_for
from app.auth.auth import AuthError, requires_auth
from ..controllers import intent as IntentController

blueprint = Blueprint('intent', __name__)
controller = IntentController


@blueprint.route('/intents', methods=['POST'])
@requires_auth('update:modules')
def create_action():
    '''
    An endpoint to POST a new intent.

    '''

    return controller.create_action()


@blueprint.route('/intents/<uuid>', methods=['PATCH'])
@requires_auth('update:modules')
def update_action(uuid):
    '''
    An endpoint to PATCH intent using a intent uuid.

    '''

    return controller.update_action(uuid)


@blueprint.route('/intents/<uuid>', methods=['DELETE'])
@requires_auth('update:modules')
def delete_action(uuid):
    '''
    An endpoint to DELETE intent using a intent uuid.

    '''

    return controller.delete_action(uuid)
