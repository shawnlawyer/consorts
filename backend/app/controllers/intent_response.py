from flask import render_template, request, jsonify, abort

from app import db
from app.models import IntentResponse, Intent


def create_action(kwargs=None):
    """Creates a IntentResponse record

    :param kwargs: dictionary to override request form values
    :type kwargs: dict

    """

    try:

        if not kwargs:

            data = request.get_json().get('data', {})

            kwargs = {
                "intent_uuid": data.get('intent_uuid'),
                "text": data.get('text'),
            }

        intent = Intent.query.filter(
            Intent.uuid == kwargs['intent_uuid']
        ).first_or_404()

        if intent.module.is_locked():
            abort(422)

        model = IntentResponse(**kwargs)

        model.insert()

        response = {
            "success": True,
            "model": model.format()
        }

        return jsonify(response)

    except:

        abort(422)


def update_action(uuid, kwargs=None):
    """Update an IntentResponse record

    :param uuid: record uuid
    :type uuid: string

    """

    if not kwargs:

        data = request.get_json().get('data', {})
        kwargs = {
            "text": data.get('text')
        }

    model = IntentResponse.query.filter(
        IntentResponse.uuid == uuid
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
    """Delete a IntentResponse record

    :param uuid: record uuid
    :type uuid: string

    """

    model = IntentResponse.query.filter(
        IntentResponse.uuid == uuid
    ).first_or_404()

    if model.intent.module.is_locked():
        abort(422)

    model.delete()

    response = {
        "success": True
    }

    return jsonify(response)
