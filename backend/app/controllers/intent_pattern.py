from flask import render_template, request, jsonify, abort

from app import db
from app.models import IntentPattern, Intent
from . import lexicon as LexiconController


def create_action(kwargs=None):
    """Creates a IntentPattern record

    :param kwargs: dictionary to override request form values
    :type kwargs: dict

    """

    if not kwargs:

        data = request.get_json().get('data', {})

        kwargs = {
            "intent_uuid": data.get('intent_uuid'),
            "text": data.get('text')
        }

    intent = Intent.query.filter(
        Intent.uuid == kwargs['intent_uuid']
    ).first_or_404()

    if intent.module.is_locked():
        abort(422)

    model = IntentPattern(**kwargs)

    model.insert()

    response = {
        "success": True,
        "model": model.format()
    }

    return jsonify(response)


def update_action(uuid, kwargs=None):
    """Update an IntentPattern record

    :param uuid: record uuid
    :type uuid: string

    """

    if not kwargs:

        data = request.get_json().get('data', {})
        kwargs = {
            "text": data.get('text')
        }

    model = IntentPattern.query.filter(
        IntentPattern.uuid == uuid
    ).first_or_404()

    if model.intent.module.is_locked():
        abort(422)

    model.update(kwargs)

    response = {
        "success": True,
        "result": model.format()
    }

    return jsonify(response)


def delete_action(uuid):
    """Delete a IntentPattern record

    :param uuid: record uuid
    :type uuid: string

    """

    model = IntentPattern.query.filter(
        IntentPattern.uuid == uuid
    ).first_or_404()

    if model.intent.module.is_locked():
        abort(422)

    model.delete()

    response = {
        "success": True
    }

    return jsonify(response)

def get_text_variations_action(uuid):
    """Processes a sequence of words, and attaches a part of speech tag to each word

    :param uuid:
    :return: JSON
    """

    model = IntentPattern.query.filter(
        IntentPattern.uuid == uuid
    ).first_or_404()

    results = LexiconController.text_variations(model.text)

    return jsonify(results)

