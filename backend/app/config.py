from envs import env
import os

basedir =  os.path.join(env('HOME'), 'backend')


class Config(object):
    """Flask config variables"""

    SQLALCHEMY_DATABASE_URI = 'postgresql://{}:{}@{}:{}/{}'.format(
        env('POSTGRES_USER'),
        env('POSTGRES_PASSWORD'),
        env('POSTGRES_HOST'),
        env('POSTGRES_PORT'),
        env('POSTGRES_DB')
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = ('SQLALCHEMY_TRACK_MODIFICATIONS')

    SECRET_KEY = env('APP_SECRET_KEY')

    APPLICATION_ROOT = '/api'

    MIGRATIONS_PATH = os.path.join(basedir, 'migrations')

    PUSHER_SETTINGS = {
        'app_id': env('PUSHER_APP_ID'),
        'key': env('PUSHER_KEY'),
        'secret': env('PUSHER_SECRET'),
        'cluster': env('PUSHER_CLUSTER')
    }

    MAX_CONTENT_LENGTH = 2 * 1024 * 1024

    UPLOAD_EXTENSIONS = ['.json']

    UPLOADS_PATH = os.path.join('', 'tmp', 'uploads')
