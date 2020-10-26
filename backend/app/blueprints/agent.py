from flask import Blueprint, render_template, request, flash, redirect, url_for
from app.auth.auth import AuthError, requires_auth
from ..controllers import agent as AgentController
import click

blueprint = Blueprint('agent', __name__)
controller = AgentController


@blueprint.route('/agents', methods=['POST'])
@requires_auth('create:agents')
def create_action():
    '''
    An endpoint to POST a new agent.

    :param agent: name text
    :param description: description text
    :type agent: str
    :type description: str

    '''

    return controller.create_action()


@blueprint.route('/agents/<uuid>/copy', methods=['POST'])
@requires_auth('create:agents')
def copy_action(uuid):
    '''
    A POST endpoint copy an agent.

    :param uuid: agent record uuid\
    :type uuid: string

    '''

    return controller.copy_action(uuid)


@blueprint.route('/agents/<uuid>/modules', methods=['POST'])
@requires_auth('create:modules')
def create_agent_module_action(uuid):
    '''
    An endpoint to POST a new module belonging to an agent.

    :param uuid: agent record uuid\
    :type uuid: string

    '''

    return controller.create_agent_module_action(uuid)

@blueprint.route('/agents/<uuid>', methods=['PATCH'])
@requires_auth('update:agents')
def update_action(uuid):
    '''
    An endpoint to PATCH agent using a agent uuid.

    :param uuid: agent record uuid\
    :type uuid: string

    '''

    return controller.update_action(uuid)


@blueprint.route('/agents/<uuid>', methods=['DELETE'])
@requires_auth('delete:agents')
def delete_action(uuid):
    '''
    An endpoint to DELETE agent using a agent uuid.

    :param uuid: agent record uuid\
    :type uuid: string

    '''

    return controller.delete_action(uuid)


@blueprint.route('/agents/<uuid>', methods=['GET'])
@requires_auth('read:agents')
def get_action(uuid):
    '''
    An endpoint to GET agent using a agent uuid.

    :param uuid: agent record uuid\
    :type uuid: string

    '''

    return controller.get_action(uuid)


@blueprint.route('/agents', methods=['GET'])
@requires_auth('read:agents')
def list_json():
    '''
    An endpoint to handle GET requests for agents,
    including pagination (every 10 agents).

    Returns a list of agents, number of total agents.
    '''

    return controller.list_json(all=True)

@blueprint.route('/agents/search', methods=['POST'])
@requires_auth('read:agents')
def search_json():
    '''
    A POST endpoint to get agents based on a search term.

    Returns any agents for whom the search term
    is a substring of the agent.
    '''

    return controller.search_json()


@blueprint.route('/agents/<uuid>/main/<flag>', methods=['PATCH'])
@requires_auth('lock:agents')
def flag_is_main_action(uuid, flag):
    '''
    PATCH endpoint to flag Agent record is_main.

    :param uuid: agent record uuid
    :param value: flag
    :type uuid: string
    :type value: string 'true'|'false'

    Returns Agent json
    '''

    return controller.flag_is_main_action(uuid, flag)

@blueprint.route('/agents/<uuid>/locked/<flag>', methods=['PATCH'])
@requires_auth('lock:agents')
def flag_is_locked_action(uuid, flag):
    '''
    PATCH endpoint to flag Agent record is_locked.

    :param uuid: agent record uuid
    :param value: flag
    :type uuid: string
    :type value: string 'true'|'false'

    Returns Agent json
    '''

    return controller.flag_is_locked_action(uuid, flag)


@blueprint.route('/agents/<uuid>/template/<flag>', methods=['PATCH'])
@requires_auth('lock:agents')
def flag_is_template_action(uuid, flag):
    '''
    PATCH endpoint to flag Agent record is_template.

    :param uuid: agent record uuid
    :param value: flag
    :type uuid: string
    :type value: string 'true'|'false'

    Returns Agent json
    '''

    return controller.flag_is_template_action(uuid, flag)


@blueprint.route('/agents/<uuid>/build', methods=["POST"])
@requires_auth('update:agents')
def queue_build_action(uuid):
    '''
    A POST endpoint to train and build an agent.

    '''
    return controller.queue_build_action(uuid)


@blueprint.cli.command("build")
@click.argument("uuid")
def build_command(uuid):
    return controller.build_action(uuid)


@blueprint.route("/chat/<uuid>", methods=["POST"])
def chat(uuid):
    '''
    A POST endpoint to chat with an agent based on uuid.

    Returns a chat response to a text input.
    '''

    return controller.chat(uuid)


@blueprint.route("/classify/<uuid>", methods=["POST"])
def classify(uuid):
    '''
    A POST endpoint to classify text with an agent based on uuid.

    Returns classification predictions of text input.
    '''

    return controller.classify(uuid)

@blueprint.route('agents/<uuid>/modules/upload', methods=['POST'])
def upload_agent_modules_action(uuid):

    return controller.upload_agent_modules_action(uuid)
