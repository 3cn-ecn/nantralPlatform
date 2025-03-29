# ruff: noqa: F403, F405

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
EMAIL_HOST = None
EMAIL_PORT = None
# No need to authenticate on localhost
EMAIL_HOST_USER = None
EMAIL_HOST_PASSWORD = None
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

AWS_ACCESS_KEY_ID = env("OVH_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = env("OVH_SECRET_ACCESS_KEY")

AWS_STORAGE_BUCKET_NAME = env("S3_BUCKET")
AWS_S3_REGION_NAME = "gra"
AWS_SES_REGION = "gra"
AWS_S3_ENDPOINT_URL = "https://s3.gra.cloud.ovh.net"
AWS_S3_CUSTOM_DOMAIN = (
    f"storage.{AWS_S3_REGION_NAME}.cloud.ovh.net/v1/"
    f"AUTH_f872c5d9108a481eafb02f903c46dbf0/{AWS_STORAGE_BUCKET_NAME}"
)

DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

AWS_S3_OBJECT_PARAMETERS = {
    "CacheControl": "max-age=86400",
    "ACL": "public-read",
}

# THIRD PARTY LIBRARIES SETTINGS

# Debug toolbar
DEBUG_TOOLBAR_CONFIG = {
    "SHOW_TOOLBAR_CALLBACK": (lambda _: DEBUG),
}
