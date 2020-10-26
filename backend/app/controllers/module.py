import os
import json
from flask import render_template, request, jsonify, abort
from werkzeug.utils import secure_filename
from app import db, pusher
from app.models import Agent, Module, Intent, IntentPattern, IntentResponse
from .consort import Consort


MODULES_PER_PAGE = 10


def create_action(data=None, push_message=True, agent=None):
    """Creates a Module record

    :param kwargs: dictionary to override request form values
    :type kwargs: dict

    """

    if not data:

        data = request.get_json().get('data', {})

    if not agent:

        agent = Agent.query.filter(Agent.uuid == data.get('agent_uuid')).first_or_404()

    kwargs = {
        "name": data.get('name'),
        "agent_uuid": agent.uuid
    }

    model = Module(**kwargs)

    model.insert()

    for intent in data.get('intents', []):

        kwargs = {
            "module_uuid": model.uuid,
            "name": intent.get('name')
        }

        intent_model = Intent(**kwargs)

        intent_model.insert()

        for pattern in intent.get('patterns', []):

            kwargs = {
                "intent_uuid": intent_model.uuid,
                "text": pattern.get('text')
            }

            pattern_model = IntentPattern(**kwargs)

            pattern_model.insert()

        for response in intent.get('responses', []):

            kwargs = {
                "intent_uuid": intent_model.uuid,
                "text": response.get('text')
            }

            response_model = IntentResponse(**kwargs)

            response_model.insert()

    response = {
        "success": True,
        "result": model.format()
    }

    if push_message and model.agent:
        pusher.trigger(u'{}'.format(model.agent.uuid), u'store', {
            u'results': [model.agent.format(deep=False)]
        })

    return jsonify(data)


def update_action(uuid, data=None):
    """Update an Module record

    :param uuid: record uuid
    :type uuid: string

    """
    if not data:

        data = request.get_json().get('data', {})

    kwargs = {
        "name": data.get('name')
    }

    model = Module.query.filter(Module.uuid == uuid).first_or_404()

    if model.is_locked():
        abort(422)

    model.update(kwargs)
    if data.get('intents'):
        for intent in model.intents:
            intent.delete()

        for intent in data.get('intents', []):

            kwargs = {
                "module_uuid": model.uuid,
                "name": intent.get('name')
            }

            intent_model = Intent(**kwargs)

            intent_model.insert()

            for pattern in intent.get('patterns', []):

                kwargs = {
                    "intent_uuid": intent_model.uuid,
                    "text": pattern.get('text')
                }

                pattern_model = IntentPattern(**kwargs)

                pattern_model.insert()

            for response in intent.get('responses', []):

                kwargs = {
                    "intent_uuid": intent_model.uuid,
                    "text": response.get('text')
                }

                response_model = IntentResponse(**kwargs)

                response_model.insert()

    response = {
        "success": True,
        "result": model.format()
    }

    if (model.agent):
        pusher.trigger(u'{}'.format(model.agent.uuid), u'store', {
            u'results': [model.agent.format(deep=False)]
        })

    return jsonify(response)


def upload_action(agent_uuid=None, push_message=True, agent=None):

    if agent_uuid and not agent:
        agent = Agent.query.filter(Agent.uuid == agent_uuid).one_or_404()

    file = request.files['file']

    data = json.loads(file.stream.read())

    data['agent_uuid'] = agent.uuid
    response = create_action(data, False, agent)



    if push_message and agent:
        pusher.trigger(u'{}'.format(agent.uuid), u'store', {
            u'results': [agent.format(deep=False)]
        })

    return response


def get_action(uuid):
    """Get an Module record

    :param id: record id
    :type id: int

    """

    model = Module.query.filter(Module.uuid == uuid).first_or_404()

    response = {
        "success": True,
        "result": model.format()
    }

    return jsonify(response)


def delete_action(uuid):
    """Delete a Module record

    :param uuid: record uuid
    :type uuid: str

    """

    model = Module.query.filter(Module.uuid == uuid).first_or_404()

    if model.is_locked():
        abort(422)

    agent_uuid = model.agent_uuid

    if model.intents:
        for intent in model.intents:
            if intent.patterns:
                for pattern in intent.patterns:
                    pattern.delete()
            if intent.responses:
                for response in intent.responses:
                    response.delete()

            intent.delete()

    model.delete()

    response = {
        "success": True
    }

    model = Agent.query.filter(Agent.uuid == agent_uuid).first_or_404()

    pusher.trigger(u'{}'.format(model.uuid), u'store', {
        u'results': [model.format(deep=False)]
    })

    return jsonify(response)


def list_json(page=None, all=False):
    """Returns json of a list of Module records

    :param page: page number
    :param all: paginate records
    :type page: int
    :type all: bool

    """

    if not all:

        if not page:

            page = request.args.get('page', 1, type=int)

        models = Module.query.paginate(
            page=page,
            per_page=MODULES_PER_PAGE
        )

    else:

        models = Module.query.order_by(Module.id).all()

    if not models:

        abort(404)

    results = {
        "success": True,
        "results": [model.format(deep=False) for model in models],
        "total_results": Module.query.count()
    }

    return jsonify(results)


def search_json(payload={}):
    """Returns json of a list of Module search records

    :param payload: payload dict
    :param page: page number
    :type search: str
    :type page: int

    """

    if not payload:

        payload = request.get_json()
        page = payload.get('page', request.args.get('page', 1))

    search = payload.get('searchTerm', '')

    query = Module.query.filter(Module.name.ilike("%" + search + "%"))

    count = query.count()

    models = query.paginate(page=page, per_page=MODULES_PER_PAGE)

    if not models.items:

        abort(404)

    response = {
        "success": True,
        "results": [model.format(deep=False) for model in models.items],
        "total_results": count
    }

    return jsonify(response)


def flag_is_noise_action(uuid, flag):
    """Flag Module record is_noise

    :param uuid: agent record uuid
    :param flag: flag
    :type uuid: string
    :type value: string 'true'|'false'

    """

    model = Module.query.filter(Module.uuid == uuid).first_or_404()

    model.update({'is_noise': True if flag == 'true' else False})

    response = {
        "success": True,
        "result": model.format(deep=False)
    }

    pusher.trigger(u'{}'.format(model.agent.uuid), u'store', {
        u'results': [model.agent.format(deep=False)]
    })

    return jsonify(response)
