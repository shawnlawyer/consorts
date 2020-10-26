from flask import Blueprint, render_template, request, flash, redirect, url_for
from app.auth.auth import AuthError, requires_auth
from ..controllers import lexicon as LexiconController

blueprint = Blueprint('lexicon', __name__)
controller = LexiconController

@blueprint.route('/lexicon/variations', methods=['POST'])
def get_text_variations_action():

    """An endpoint to get parts of speech tag to each word in an intent pattern text

    :param uuid:
    :return: JSON
    """

    return controller.get_text_variations_action()
