from flask import session
import random
from app.models import Agent, Module, Intent
from .intent_classifier import Classifier


class Consort(object):

    models = {}

    def __init__(
            self,
            db_model=None
    ):

        self.db_model = db_model
        self.classifier = Classifier(db_model)

    def intent(self, results):

        result = results.pop()
        classification = self.classifier.classes[result[0]]
        if classification == 'not_found':
            return Response(classification, '', result[1])

        intent_model = Intent.query.filter(
            Intent.uuid == classification
        ).first()

        intent_response = random.choice(intent_model.responses)
        response = Response(
            intent_model.name,
            intent_response.text,
            result[1]
        )

        return response

    def chat(self, input):

        response = self.intent(self.classifier.classify(input))

        return response


class Response(object):

    def __init__(
        self,
        classification='not_found',
        response=None,
        confidence=1.0,
        input_type='text'
    ):
        self.response = response
        self.confidence = float(confidence)
        self.classification = classification
        self.input_type = input_type
