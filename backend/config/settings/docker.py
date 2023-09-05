"""A configuration for local docker use in development.

DO NOT USE IN PRODUCTION.
"""

from celery.schedules import crontab
from .base import *

print("Using docker config")


#######################
### DJANGO SETTINGS ###
#######################


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRES_DB_STAGING') if STAGING else env('POSTGRES_DB'),
        'USER': env('POSTGRES_USER'),
        'PASSWORD': env('POSTGRES_PASSWORD'),
        'HOST': env('DB_HOSTNAME'),
        'PORT': env('DB_PORT'),
        'CONN_MAX_AGE': 600,
    },
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.'
        + 'UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.'
        + 'CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.'
        + 'NumericPasswordValidator'},
]

ALLOWED_HOSTS = ["django", "localhost"]


# Cache config
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
        'LOCATION': '127.0.0.1:11211',
    },
    "extra_settings": {
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        'LOCATION': '127.0.0.1:11211',
        'TIMEOUT': 60,
    },
}
INTERNAL_IPS = [
    '127.0.0.1',
]


#######################
### CELERY SETTINGS ###
#######################

CELERY_BROKER_URL = 'redis://redis:6379'
CELERY_RESULT_BACKEND = 'redis://redis:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Europe/Paris'

# make the cron tasks be executed every monday at 4am
CELERY_BEAT_SCHEDULE = {
    'remove-inactive-accounts': {
        'task': 'apps.account.tasks.remove_inactive_accounts',
        'schedule': crontab(minute=0, hour=4, day_of_week=1)
    },
    'remove-temp-access': {
        'task': 'apps.account.tasks.remove_temporary_access',
        'schedule': crontab(minute=0, hour=4, day_of_week=1)
    },
    'clean-notifications': {
        'task': 'apps.notification.tasks.clean_notifications',
        'schedule': crontab(minute=0, hour=4, day_of_week=1)
    }
}


######################################
### THIRD PARTY LIBRARIES SETTINGS ###
######################################

# Debug toolbar
DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": (lambda _: DEBUG),
}

DJANGO_VITE_DEV_MODE = False
