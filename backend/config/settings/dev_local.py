from .base import *

print("Running dev settings")

"""
#######################
### DJANGO SETTINGS ###
#######################
"""

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    },
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = []


ALLOWED_HOSTS = []

INTERNAL_IPS = [
    "127.0.0.1",
]

# Dummy cache for dev
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    }
}
