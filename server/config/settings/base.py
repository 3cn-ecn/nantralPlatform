"""
Django settings for nantralPlatform project.

Generated by 'django-admin startproject' using Django 3.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import environ
env = environ.Env()
# reading .env file
environ.Env.read_env()

# Build paths inside the project like this: join(BASE_DIR, "directory")
BASE_PATH = environ.Path(__file__) - 3
BASE_DIR = str(BASE_PATH)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/



secret = environ.Env(
    GOOGLE_API_KEY=(str, 'Changeme'),
    DB_HOSTNAME=(str, 'database'),
    DB_PORT=(str, '5432'),
    POSTGRES_USER=(str, 'nantralien'),
    POSTGRES_PASSWORD=(str, 'nantral')
)


# Application definition

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'crispy_forms',
    'storages'
]

COMMON_APPS = [
    'apps.account',
    'apps.student',
    'apps.home',
    'apps.group',
    'apps.academic',
    'apps.event'
]

INSTALLED_APPS = DJANGO_APPS + COMMON_APPS + THIRD_PARTY_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

AUTHENTICATION_BACKENDS = [
    'apps.account.emailAuthBackend.EmailBackend',
    "django.contrib.auth.backends.ModelBackend",
    ]

LOGIN_REDIRECT_URL = 'None'
LOGIN_URL = '/account/login/'

MESSAGE_STORAGE = 'django.contrib.messages.storage.cookie.CookieStorage'

ROOT_URLCONF = 'config.urls'

CRISPY_TEMPLATE_PACK =  'bootstrap4'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'



# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'