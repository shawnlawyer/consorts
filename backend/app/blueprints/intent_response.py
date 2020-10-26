from flask import Blueprint, render_template, request, flash, redirect, url_for
from app.auth.auth import AuthError, requires_auth
from ..controllers import intent_response as IntentResponseController

blueprint = Blueprint('intent_response', __name__)
controller = IntentResponseController


@blueprint.route('/intent/responses', methods=['POST'])
@requires_auth('update:modules')
def create_action():
    '''
    An endpoint to POST a new intent response.

    '''

    return controller.create_action()


@blueprint.route('/intent/responses/<uuid>', methods=['PATCH'])
@requires_auth('update:modules')
def update_action(uuid):
    '''
    An endpoint to PATCH intent response using a uuid.

    '''

    return controller.update_action(uuid)


@blueprint.route('/intent/responses/<uuid>', methods=['DELETE'])
@requires_auth('update:modules')
def delete_action(uuid):
    '''
    An endpoint to DELETE intent response using a uuid.

    '''

    return controller.delete_action(uuid)
