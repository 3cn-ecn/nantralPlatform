# flake8: noqa: F405

from .docker import *  # noqa: F403

print("Running prod config")


#######################
### DJANGO SETTINGS ###
#######################

DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

if STAGING:
    ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS_STAGING").split(" ")
else:
    ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS").split(" ")

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp'
EMAIL_PORT = '25'
# No need to authenticate on localhost
EMAIL_HOST_USER = None
EMAIL_HOST_PASSWORD = None
# Specify default sender emails
DEFAULT_FROM_EMAIL = "Nantral-Platform <no-reply@nantral-platform.fr>"
SERVER_EMAIL = "Admin Nantral-Platform <admin@nantral-platform.fr>"

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '[DJANGO] %(levelname)s %(asctime)s %(module)s '
            '%(name)s.%(funcName)s:%(lineno)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        }
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        '*': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'ERROR'),
            'propagate': False,
        },
    },
}


######################################
### THIRD PARTY LIBRARIES SETTINGS ###
######################################

# Debug toolbar
DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": (lambda _: DEBUG),
}
