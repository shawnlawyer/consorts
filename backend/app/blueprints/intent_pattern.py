from flask import Blueprint, render_template, request, flash, redirect, url_for
from app.auth.auth import AuthError, requires_auth
from ..controllers import intent_pattern as IntentPatternController

blueprint = Blueprint('intent_pattern', __name__)
controller = IntentPatternController


@blueprint.route('/intent/patterns', methods=['POST'])
@requires_auth('update:modules')
def create_action():
    '''
    An endpoint to POST a new intent pattern.

    '''

    return controller.create_action()


@blueprint.route('/intent/patterns/<uuid>', methods=['PATCH'])
@requires_auth('update:modules')
def update_action(uuid):
    '''
    An endpoint to PATCH intent pattern using a uuid.

    '''

    return controller.update_action(uuid)


@blueprint.route('/intent/patterns/<uuid>', methods=['DELETE'])
@requires_auth('update:modules')
def delete_action(uuid):
    '''
    An endpoint to DELETE intent pattern using a uuid.

    '''

    return controller.delete_action(uuid)

@blueprint.route('/intent/patterns/<uuid>/variations', methods=['GET','POST'])
#@requires_auth('read:modules')
def get_text_variations_action(uuid):

    """An endpoint to get parts of speech tag to each word in an intent pattern text

    :param uuid:
    :return: JSON
    """

    return controller.get_text_variations_action(uuid)
