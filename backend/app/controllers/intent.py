from flask import render_template, request, jsonify, abort

from app import db
from app.models import Intent, Module


def create_action(kwargs=None):
    """Creates a Intent record

    :param kwargs: dictionary to override request form values
    :type kwargs: dict

    """
    if not kwargs:

        data = request.get_json().get('data', {})

        module = Module.query.filter(
            Module.uuid == data.get('module_uuid')
        ).first_or_404()

        kwargs = {
            "module_id": module.id,
            "name": data.get('name'),
        }

    else:

        module = Module.query.filter(
            Module.uuid == kwargs['module_uuid']
        ).first_or_404()

        kwargs['module_id'] = module.id

    if module.is_locked():
        abort(422)

    model = Intent(**kwargs)

    model.insert()

    response = {
        "success": True,
        "model": model.format()
    }

    return jsonify(response)


def update_action(uuid, kwargs=None):
    """Update an Intent record

    :param uuid: Intent record uuid
    :type uuid: str

    """

    if not kwargs:

        data = request.get_json().get('data', {})
        kwargs = {
            "name": data.get('name')
        }

    model = Intent.query.filter(
        Intent.uuid == uuid
    ).first_or_404()

    if model.module.is_locked():
        abort(422)

    model.update(kwargs)

    response = {
        "success": True,
        "result": model.format()
    }

    return jsonify(response)


def delete_action(uuid):
    """Delete a Intent record

    :param uuid: Intent record uuid
    :type uuid: str

    """

    model = Intent.query.filter(
        Intent.uuid == uuid
    ).first_or_404()

    if model.module.is_locked():
        abort(422)

    model.delete()

    response = {
        "success": True
    }

    return jsonify(response)
