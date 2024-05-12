# ruff: noqa: F403, F405

from .base import *

print("Running dev settings")  # noqa: T201

# DJANGO SETTINGS

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    },
}

ALLOWED_HOSTS = []

INTERNAL_IPS = [
    "127.0.0.1",
]

# Dummy cache for dev
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    },
}
