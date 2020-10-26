from flask import Blueprint, render_template, request, flash, redirect, url_for
from app.auth.auth import AuthError, requires_auth
from ..controllers import module as ModuleController

blueprint = Blueprint('module', __name__)
controller = ModuleController


@blueprint.route('/modules', methods=['POST'])
@requires_auth('create:modules')
def create_action():
    '''
    An endpoint to POST a new `module.

    :param name: name text
    :param description: description text
    :type name: str
    :type description: str

    '''

    return controller.create_action()


@blueprint.route('/modules/<uuid>', methods=['PATCH'])
@requires_auth('update:modules')
def update_action(uuid):
    '''
    An endpoint to PATCH module using a module uuid.

    '''

    return controller.update_action(uuid)


@blueprint.route('/modules/<uuid>', methods=['DELETE'])
@requires_auth('delete:modules')
def delete_action(uuid):
    '''
    An endpoint to DELETE module using a module uuid.

    '''

    return controller.delete_action(uuid)


@blueprint.route('/modules/<uuid>', methods=['GET'])
@requires_auth('read:modules')
def get_action(uuid):
    '''
    An endpoint to GET module using a module uuid.

    '''

    return controller.get_action(uuid)


@blueprint.route('/modules')
@requires_auth('read:modules')
def list_json():
    '''
    An endpoint to handle GET requests for modules,
    including pagination (every 10 modules).

    Returns a list of modules, number of total modules.
    '''


    return controller.list_json(all=True)


@blueprint.route('/modules/search', methods=['POST'])
@requires_auth('read:modules')
def search_json():
    '''
    A POST endpoint to get modules based on a search term.

    Returns any modules for whom the search term
    is a substring of the module.
    '''

    return controller.search_json()


@blueprint.route('/modules/<uuid>/noise/<flag>', methods=['PATCH'])
@requires_auth('lock:agents')
def flag_is_noise_action(uuid, flag):
    '''
    PATCH endpoint to flag Module record is_noise.

    :param uuid: agent record uuid
    :param value: flag
    :type uuid: string
    :type value: string 'true'|'false'

    Returns Module json
    '''

    return controller.flag_is_noise_action(uuid, flag)

