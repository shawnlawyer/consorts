import os
import json
from flask import render_template, request, redirect, url_for, jsonify, abort
import urllib.parse
import subprocess
from app import db, pusher
from app.models import Agent, Module, Intent, IntentPattern, IntentResponse
from .consort import Consort
from . import module as ModuleController
from . import lexicon as LexiconController
from .intent_classifier import Classifier

AGENTS_PER_PAGE = 10


def create_action(kwargs=None):
    """Creates a Agent record

    :param kwargs: dictionary to override request form values
    :type kwargs: dict

    """

    try:

        if not kwargs:

            data = request.get_json().get('data', {})

            kwargs = {
                "name": data.get('name'),
                "description": data.get('description'),
                "type": data.get('type')
            }

        model = Agent(**kwargs)

        model.insert()

        response = {
            "success": True,
            "result": model.format()
        }

        return jsonify(response)

    except:

        abort(422)


def update_action(uuid, kwargs=None):
    """Update an Agent record

    :param uuid: Agent record uuid
    :type uuid: string

    """

    if not kwargs:

        data = request.get_json().get('data', {})
        kwargs = {
            "name": data.get('name'),
            "description": data.get('description')
        }

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    if model.is_locked:
        abort(422)

    model.update(kwargs)

    response = {
        "success": True,
        "result": model.format(deep=False)
    }

    return jsonify(response)


def create_agent_module_action(uuid):
    """
    create a new module belonging to an agent.

    :param uuid: Agent record uuid
    :type uuid: string

    """

    return ModuleController.create_action(uuid)


def copy_action(uuid, kwargs=None):
    """Copy an Agent record

    :param uuid: Agent record uuid
    :type uuid: string

    """

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    if not kwargs:

        data = request.get_json().get('data', {})

        kwargs = {
            "name": data.get('name') if data.get('name') else model.name,
            "type": data.get('type') if data.get('name') else model.type,
        }

    copy = Agent(**kwargs)
    copy.name = "copy:{}:{}".format(model.uuid, copy.uuid)
    copy.insert()

    if model.modules:
        for module in model.modules:
            module_dict = module.format(deep=True)
            module_dict['agent_uuid'] = copy.uuid
            ModuleController.create_action(module_dict)

    response = {
        "success": True,
        "result": copy.format(deep=False)
    }

    """
    pusher.trigger(u'{}'.format(model.uuid), u'store', {
        u'results': [response.result]
    })
    """

    return jsonify(response)


def get_action(uuid):
    """Get an Agent record

    :param uuid: Agent record uuid
    :type uuid: string

    """

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    response = {
        "success": True,
        "result": model.format(deep=False)
    }

    return jsonify(response)


def delete_action(uuid):
    """Delete an Agent record

    :param uuid: Agent record uuid
    :type uuid: string

    """

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    if model.is_locked:
        abort(422)

    model.delete()

    if os.path.exists("/tmp/{}.pkl".format(uuid)):
        os.remove("/tmp/{}.pkl".format(uuid))

    if os.path.exists("/tmp/{}.h5".format(uuid)):
        os.remove("/tmp/{}.h5".format(uuid))

    response = {
        "success": True
    }

    pusher.trigger(u'{}'.format(uuid), u'clear', {
        u'uuid': uuid
    })

    return jsonify(response)


def list_json(page=None, all=False):
    """Returns json of a list of Agent records

    :param page: page number
    :type page: int

    """

    if not all:

        if not page:

            page = request.args.get('page', 1, type=int)

        models = Agent.query.paginate(
            page=page,
            per_page=AGENTS_PER_PAGE
        ).items

    else:

        models = Agent.query.order_by(Agent.id).all()

    if not models:

        abort(404)

    results = {
        "results": [model.format(deep=False) for model in models],
        "total_results": Agent.query.count(),
        "success": True
    }

    return jsonify(results)


def search_json(payload={}):
    """Returns json of a list of Agent search records

    :param payload: payload dict
    :param page: page number
    :type search: str
    :type page: int

    """

    if not payload:

        payload = request.get_json()
        page = payload.get('page', request.args.get('page', 1))

    search = payload.get('searchTerm', '')

    query = Agent.query.filter(Agent.question.ilike("%" + search + "%"))

    count = query.count()

    models = query.paginate(page=page, per_page=AGENTS_PER_PAGE)

    if not models.items:

        abort(404)

    results = {
        "results": [model.format(deep=False) for model in models.items],
        "total_results": count
    }

    return jsonify(results)


def flag_is_locked_action(uuid, flag):
    """Flag Agent record is_locked

    :param uuid: agent record uuid
    :param flag: flag
    :type uuid: string
    :type flag: string 'true'|'false'

    """

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    model.update({'is_locked': True if flag == 'true' else False})

    response = {
        "success": True,
        "result": model.format(deep=False)
    }

    return jsonify(response)


def flag_is_template_action(uuid, flag):
    """Flag Agent record is_template

    :param uuid: agent record uuid
    :param flag: flag
    :type uuid: string
    :type value: string 'true'|'false'

    """

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    model.update({'is_template': True if flag == 'true' else False})

    response = {
        "success": True,
        "result": model.format(deep=False)
    }

    return jsonify(response)


def flag_is_main_action(uuid, flag):
    """Flag Agent record is_template

    :param uuid: agent record uuid
    :param flag: flag
    :type uuid: string
    :type value: string 'true'|'false'

    """

    results = []

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    if flag == 'true':

        old_main = Agent.query.filter(Agent.is_main == True).one_or_none()

        if old_main and old_main.uuid is not model.uuid:

            old_main.update({'is_main': False})

            results.append(old_main.format(deep=False))

    model.update({'is_main': True if flag == 'true' else False})

    results.append(model.format(deep=False))

    response = {
        "success": True,
        "results": results
    }

    return jsonify(response)


def queue_build_action(uuid):
    """ success True

    :param uuid: module record uuid
    :type uuid: str

    """

    model = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    subprocess.Popen(['flask', 'agent', 'build', model.uuid])

    response = {
        "success": True
    }

    return jsonify(response)


def build_action(uuid):
    """ success True

    :param uuid: Agent record uuid
    :type uuid: str

    """

    model = Agent.query.filter(Agent.uuid == uuid).one_or_none()

    if model is None:
        return 0

    model.update({'is_building': True})

    pusher.trigger(u'{}'.format(model.uuid), u'start', model.format())

    try:
        consort = Consort(model)
        consort.classifier.build()
        model.update({'is_building': False})
        pusher.trigger(u'{}'.format(model.uuid), u'complete', model.format())
        return 1
    except:
        model.update({'is_building': False})
        pusher.trigger(u'{}'.format(model.uuid), u'complete', model.format())
        return 0


def chat(identifier, sentence=None):
    """chat agent with the Agent record

    :param name: agent record name
    :type name: string

    """
    if not sentence:
        data = request.get_json()
        sentence = urllib.parse.unquote_plus(data.get('message', '')).strip()
    else:
        sentence = urllib.parse.unquote_plus(sentence).strip()

    if identifier == 'main':
        agent = Agent.query.filter(Agent.is_main == True).first_or_404()
    else:
        agent = Agent.query.filter(Agent.uuid == identifier).first_or_404()
    """
    if sentence.lower().startswith('build'):

        queue_build_action(agent.uuid)
        return jsonify({
            'classification': 'build_agent',
            'response': "Okay, I'm Queueing {} to build now".format(agent.name),
            'confindence': 1.0,
            'input_type': 'text'
        })

    if sentence.lower().startswith('expand:'):

        result = LexiconController.get_synsets_action([word.strip() for word in sentence.lstrip('expand:').strip().split(',')])

        return jsonify({
            'classification': 'expand_words',
            'response': json.dumps(result['results'], sort_keys=False, indent=4),
            'confindence': 1.0,
            'input_type': 'text'
        })
    """
    if sentence.lower().startswith('define:'):
        words = [word.strip() for word in sentence.lstrip('define:').strip().split(',')]
        definations = LexiconController.get_definations_action(words)
        definations = definations.get('results')
        response = ''
        for key, results in definations.items():
            response += """{}
                """.format(key)
            pos = {}
            for result in results['results']:
                if result.get('word') != key:
                    continue
                if result.get('pos') not in pos:
                    pos[result.get('pos')] = """
                    {}.
                    """.format(result.get('pos'))

                pos[result.get('pos')] += """
                - {}
                examples:
                {}
                """.format(result.get('defination',''), "\n".join(result.get('examples',[])))

            for key, text in pos.items():
                response += text

        return jsonify({
            'classification': 'expand_words',
            'response': response,
            'confindence': 1.0,
            'input_type': 'text'
        })

    consort = Consort(agent)
    response = consort.chat(sentence)
    return jsonify({
        'classification': response.classification,
        'response': response.response,
        'confindence': response.confidence,
        'input_type': response.input_type
    })


def classify(identifier):
    """chat agent with the Agent record

    :param name: agent record name
    :type name: string

    """
    agent = Agent.query.filter(Agent.uuid == identifier).first_or_404()

    data = request.get_json()


    classifier = Classifier(agent)
    input = urllib.parse.unquote_plus(data.get('input', ''))
    results = []
    for result in classifier.classify(input):
        classification = "not_found"
        uuid = None

        if classifier.classes[result[0]] != "not_found":
            classification = Intent.query.filter(Intent.uuid == classifier.classes[result[0]]).first().name;
            uuid = classifier.classes[result[0]]
        confindence = float(result[1])

        results.append({
            'classification': classification,
            'uuid': uuid,
            'confindence': confindence
        })

    return jsonify({
        'input': input,
        'results': results,
        'success': True
    })


def upload_agent_modules_action(uuid):
    """
    Uploads Agent modules

    """

    agent = Agent.query.filter(Agent.uuid == uuid).first_or_404()

    return ModuleController.upload_action(agent=agent)
