# flake8: noqa: F405
from .base import *  # noqa: F403

print("Running dev settings")

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


ALLOWED_HOSTS = []

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

if 'MAPBOX_API_KEY' in env:
    MAPBOX_API_KEY = env('MAPBOX_API_KEY')
else:
    MAPBOX_API_KEY = ''

if 'MAPBOX_API_KEY' in env:
    DISCORD_ADMIN_MODERATION_WEBHOOK = env('DISCORD_ADMIN_MODERATION_WEBHOOK')
else:
    DISCORD_ADMIN_MODERATION_WEBHOOK = ''

if 'GITHUB_USER' in env:
    GITHUB_USER = env('GITHUB_USER')
    GITHUB_TOKEN = env('GITHUB_TOKEN')
else:
    GITHUB_USER = ''
    GITHUB_TOKEN = ''

INTERNAL_IPS = [
    '127.0.0.1',
]

# Dummy cache for dev
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}
