import os


class BaseConfig(object):
    DEBUG = os.environ.get('DEBUG', True)
    TESTING = False
    SECRET_KEY = 'emtool'
    POSTGRES = {
        'user': 'postgres',
        'pw': 'password',
        'db': 'entity_matching_tool',
        'host': 'localhost',
        'port': '5432',
    }
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI',
                              'postgresql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s' % POSTGRES)
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app_config = BaseConfig
