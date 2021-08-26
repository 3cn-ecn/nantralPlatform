"""A configuration for local docker use in developpment. DO NOT USE IN PRODUCTION."""
from .base import *

print("Using docker config")
DEBUG = True

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': secret('DB_NAME'),
        'USER': secret('POSTGRES_USER'),
        'PASSWORD': secret('POSTGRES_PASSWORD'),
        'HOST': secret('DB_HOSTNAME'),
        'PORT': secret('DB_PORT'),
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

AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')

AWS_STORAGE_BUCKET_NAME = env('S3_BUCKET')
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
    'ACL': 'public-read'
}
AWS_S3_REGION_NAME = 'eu-west-3'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "test"

ALLOWED_HOSTS = ["django"]

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

AWS_SES_REGION = 'eu-central-1'


MAPBOX_API_KEY = env('MAPBOX_API_KEY')

GITHUB_USER = env('GITHUB_USER')
GITHUB_TOKEN = env('GITHUB_TOKEN')


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


def show_toolbar(request):
    return True


DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": show_toolbar,
}
