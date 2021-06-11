import os
from .base import *

DEBUG = True

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3')
    },
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
]


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'dev_key'


ALLOWED_HOSTS = ['*']

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

if 'MAPBOX_API_KEY' in env:
    MAPBOX_API_KEY = env('MAPBOX_API_KEY')
else:
    MAPBOX_API_KEY = ''

if 'GITHUB_USER' in env:
    GITHUB_USER = env('GITHUB_USER')
    GITHUB_TOKEN = env('GITHUB_TOKEN')
else:
    GITHUB_USER = ''
    GITHUB_TOKEN = ''


MEDIA_ROOT = 'media/'
MEDIA_URL = '/media/'