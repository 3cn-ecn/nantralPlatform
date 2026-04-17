# ruff: noqa: F403, F405

from botocore.client import Config as BotoConfig

from .docker import *

print("Running prod config")  # noqa: T201

# DJANGO SETTINGS

DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

if STAGING:
    ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS_STAGING").split(" ")
else:
    ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS").split(" ")

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_USE_SSL = True
EMAIL_USE_TLS = False
# No need to authenticate on localhost
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
# Specify default sender emails
DEFAULT_FROM_EMAIL = "Nantral Platform <no-reply@nantral-platform.fr>"
SERVER_EMAIL = "Nantral Platform Server <server@nantral-platform.fr>"

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "[DJANGO] %(levelname)s %(asctime)s %(module)s %(name)s.%(funcName)s:%(lineno)s: %(message)s",
        },
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "default",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "*": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "ERROR"),
            "propagate": False,
        },
    },
}

# OVH MEDIA STORAGE SETTINGS

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            # Auth
            "access_key": env("OVH_ACCESS_KEY_ID"),
            "secret_key": env("OVH_SECRET_ACCESS_KEY"),
            # Bucket config
            "bucket_name": env("S3_BUCKET"),
            "object_parameters": {
                "CacheControl": "max-age=86400",
            },
            "default_acl": "public-read",
            "region_name": "gra",
            "endpoint_url": "https://s3.gra.cloud.ovh.net",
            "custom_domain": f"storage.gra.cloud.ovh.net/v1/AUTH_f872c5d9108a481eafb02f903c46dbf0/{env('S3_BUCKET')}",
            "client_config": BotoConfig(
                request_checksum_calculation="when_required",
                response_checksum_validation="when_required",
            ),
        },
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}

# THIRD PARTY LIBRARIES SETTINGS

# Debug toolbar
DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": (lambda _: DEBUG),
}
