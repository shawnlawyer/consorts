from flask import Blueprint, render_template, request, jsonify


def index_page():
    """Returns the rendered page for the application portal"""

    return jsonify({
        "success": True,
        "error": 200,
        "message": "api root",
    }), 200


def unprocessable_json(error=None):
    """Returns json for resource processing error"""

    return jsonify({
        "success": False,
        "error": 422,
        "message": "unprocessable",
    }), 422


def not_found_error_json(error=None):
    """Returns json for resource not found"""

    return jsonify({
        "success": False,
        "error": 404,
        "message": "resource not found",
    }), 404


def server_error_json(error=None):
    """Returns json for a server error"""

    return jsonify({
        "success": False,
        "error": 500,
        "message": "server error",
    }), 500
