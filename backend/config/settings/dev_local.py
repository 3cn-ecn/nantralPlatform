# flake8: noqa: F405
from .base import *  # noqa: F403

print("Running dev settings")


#######################
### DJANGO SETTINGS ###
#######################

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

INTERNAL_IPS = [
    '127.0.0.1',
]

# Dummy cache for dev
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}
