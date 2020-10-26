import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy
from envs import env
import requests

from app import app, db
from app.models import Agent, Module


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = app
        self.client = self.app.test_client
        self.db = db
        self.test_user_token = env('AUTH0_TEST_USER_AUTH_TOKEN')

    def tearDown(self):
        """Executed after tests"""
        pass

    def test_get_agents(self):

        response = self.client().get(
            "/api/agents",
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        data = json.loads(response.data.decode())

        self.assertTrue(isinstance(data.get("results"), list))

    def test_get_modules(self):

        response = self.client().get(
            "/api/modules",
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        data = json.loads(response.data.decode())

        self.assertTrue(isinstance(data.get("results"), list))

    def test_delete_agent(self):

        kwargs = {
            "name": "TestAgent"
        }

        model = Agent(**kwargs)

        model.insert()

        response = self.client().delete(
            "/api/agents/{}".format(model.id),
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        model = Agent.query.filter(Agent.name == kwargs.get('name')).one_or_none()

        self.assertIsNone(model)

    def test_delete_modules(self):

        kwargs = {
            "name": "TestModule"
        }

        model = Module(**kwargs)

        model.insert()

        response = self.client().delete(
            "/api/modules/{}".format(model.id),
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        model = Module.query.filter(Module.name == kwargs.get('name')).one_or_none()

        self.assertIsNone(model)

    def test_create_agent(self):

        kwargs = {
            "name": "TestAgent"
        }

        response = self.client().post(
            "/api/agents",
            json={"data":kwargs},
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        data = json.loads(response.data.decode())

        model = Agent.query.filter(Agent.name == kwargs.get('name')).one_or_none()

        self.assertIsNotNone(model)

        model.delete()

    def test_create_module(self):

        kwargs = {
            "name": "TestModule"
        }

        response = self.client().post(
            "/api/modules",
            json={"data":kwargs},
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        data = json.loads(response.data.decode())

        model = Module.query.filter(Module.name == kwargs.get('name')).one_or_none()

        self.assertIsNotNone(model)

        model.delete()

    def test_lock_agent(self):

        kwargs = {
            "name": "TestModule"
        }

        model = Module(**kwargs)

        model.insert()

        response = self.client().patch(
            "/api/agents/{}/lock".format(model.id),
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        model = Module.query.filter(Module.name == kwargs.get('name')).one_or_none()

        self.assertFalse(model.is_locked, True)

        model.delete()

    def test_unlock_agent(self):

        kwargs = {
            "name": "TestModule"
        }

        model = Module(**kwargs)

        model.insert()

        model.update({"is_locked" : True})

        response = self.client().patch(
            "/api/agents/{}/unlock".format(model.id),
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        model = Module.query.filter(Module.name == kwargs.get('name')).one_or_none()

        self.assertFalse(model.is_locked, False)

        model.delete()

    def test_404_error(self):

        response = self.client().get(
            "/api/not_an_endpoint",
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 404)
        self.assertFalse(data.get("success", True))

    def test_405_error(self):

        response = self.client().post(
            "/api/agents/1",
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 405)
        self.assertFalse(data.get("success", True))

    def test_422_error(self):

        kwargs = {

        }

        response = self.client().post(
            "/api/agents",
            json=kwargs,
            headers=dict(
                Authorization='Bearer ' + env('AUTH0_TEST_USER_AUTH_TOKEN')
            )
        )

        data = json.loads(response.data.decode())

        self.assertEqual(response.status_code, 422)
        self.assertFalse(data.get("success", True))


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
