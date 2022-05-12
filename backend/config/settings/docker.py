"""A configuration for local docker use in development.
DO NOT USE IN PRODUCTION."""
# flake8: noqa: F405
from celery.schedules import crontab

from .base import *  # noqa: F403

print("Using docker config")


#######################
### DJANGO SETTINGS ###
#######################


# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE':       'django.db.backends.postgresql',
        'NAME':         env('DB_NAME_STAGING') if STAGING else env('DB_NAME'),
        'USER':         env('POSTGRES_USER'),
        'PASSWORD':     env('POSTGRES_PASSWORD'),
        'HOST':         env('DB_HOSTNAME'),
        'PORT':         env('DB_PORT'),
        'CONN_MAX_AGE': 600,
    },
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "test"

ALLOWED_HOSTS = ["django", "localhost"]

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# Cache config
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
INTERNAL_IPS = [
    '127.0.0.1',
]


##################################
### OVH MEDIA STORAGE SETTINGS ###
##################################

AWS_ACCESS_KEY_ID = env('OVH_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('OVH_SECRET_ACCESS_KEY')

AWS_STORAGE_BUCKET_NAME = env('S3_BUCKET')
AWS_S3_REGION_NAME = 'gra'
AWS_SES_REGION = 'gra'
AWS_S3_CUSTOM_DOMAIN = f'storage.{AWS_S3_REGION_NAME}.cloud.ovh.net/v1/AUTH_f872c5d9108a481eafb02f903c46dbf0/{AWS_STORAGE_BUCKET_NAME}'
AWS_S3_ENDPOINT_URL = "https://s3.gra.cloud.ovh.net"

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
    'ACL': 'public-read'
}


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
