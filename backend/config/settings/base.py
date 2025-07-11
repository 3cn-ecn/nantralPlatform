"""Django settings for nantralPlatform project.

Generated by 'django-admin startproject' using Django 3.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

import environ

# import all the environment variables, defining their type and their default
# value if they are missing in .env file
env = environ.Env(
    # optional
    GITHUB_USER=(str, ""),
    GITHUB_TOKEN=(str, ""),
    MAPBOX_API_KEY=(str, ""),
    DISCORD_TOKEN=(str, ""),
    DISCORD_CHANNEL_ID=(str, ""),
    DISCORD_ADMIN_MODERATION_WEBHOOK=(str, ""),
    WP_ADMIN_EMAIL=(str, ""),
    WP_PUBLIC_KEY=(str, ""),
    WP_PRIVATE_KEY=(str, ""),
    STAGING=(bool, False),
    # docker needed
    DB_HOSTNAME=(str, ""),
    DB_PORT=(int, 0),
    POSTGRES_USER=(str, ""),
    POSTGRES_PASSWORD=(str, ""),
    POSTGRES_DB=(str, ""),
    POSTGRES_DB_STAGING=(str, ""),
    # prod needed
    SECRET_KEY=(str, ""),
    DJANGO_ALLOWED_HOSTS=(str, ""),
    DJANGO_ALLOWED_HOSTS_STAGING=(str, ""),
    EMAIL_HOST=(str, ""),
    EMAIL_PORT=(str, ""),
    EMAIL_HOST_USER=(str, ""),
    EMAIL_HOST_PASSWORD=(str, ""),
    OVH_ACCESS_KEY_ID=(str, ""),
    OVH_SECRET_ACCESS_KEY=(str, ""),
    S3_BUCKET=(str, ""),
    # for codespaces only (automatically retrieved from the codespace)
    CODESPACES=(bool, False),
    CODESPACE_NAME=(str, ""),
    GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN=(str, ""),
)
env.read_env()

# DJANGO SETTINGS

DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "dev-key"  # noqa: S105

# Build paths inside the project like this: join(BASE_DIR, "directory")
BASE_PATH = environ.Path(__file__) - 3
BASE_DIR = str(BASE_PATH)

# Applications definition
DJANGO_APPS = [
    "modeltranslation",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.messages",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    "django.contrib.admindocs",
]
THIRD_PARTY_APPS = [
    "crispy_bootstrap5",
    "crispy_forms",
    "debug_toolbar",
    "django_celery_beat",
    "django_ckeditor_5",
    "extra_settings",
    "push_notifications",
    "rest_framework",
    "storages",
    "django_vite",
    "django_rest_passwordreset",
    "simple_history",
]
COMMON_APPS = [
    "apps.account",
    "apps.core",
    "apps.event",
    "apps.family",
    "apps.group",
    "apps.notification",
    "apps.post",
    "apps.roommates",
    "apps.signature",
    "apps.sociallink",
    "apps.student",
]
ARCHIVED_APPS = [
    "apps._archived.exchange",
    "apps._archived.club",
    "apps._archived.liste",
    "apps._archived.administration",
    "apps._archived.academic",
]
INSTALLED_APPS = DJANGO_APPS + COMMON_APPS + THIRD_PARTY_APPS + ARCHIVED_APPS

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
]

MESSAGE_STORAGE = "django.contrib.messages.storage.cookie.CookieStorage"

ROOT_URLCONF = "config.urls"
LOGIN_REDIRECT_URL = "None"
LOGIN_URL = "/login"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "apps.core.context_processors.navbar_context",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
AUTH_USER_MODEL = "account.User"
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "fr-fr"
LANGUAGES = [
    ("fr", "Français"),
    ("en", "English"),
]
LANGUAGE_COOKIE_NAME = "language"
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Model translation
MODELTRANSLATION_FALLBACK_LANGUAGES = ("en", "fr")
MODELTRANSLATION_CUSTOM_FIELDS = ("CKEditor5Field",)

# Compile frontend with VITE
DJANGO_VITE_ASSETS_PATH = os.path.join(BASE_DIR, "static/front")
DJANGO_VITE_DEV_MODE = True
DJANGO_VITE_DEV_SERVER_PORT = 5173

if env("CODESPACES"):
    CODESPACE_NAME = env("CODESPACE_NAME")
    CODESPACE_DOMAIN = env("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
    DJANGO_VITE_DEV_SERVER_PROTOCOL = "https"
    DJANGO_VITE_DEV_SERVER_HOST = f"{CODESPACE_NAME}-5173.{CODESPACE_DOMAIN}"
    DJANGO_VITE_DEV_SERVER_PORT = 443

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = "/static/"
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
    DJANGO_VITE_ASSETS_PATH,
]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"


# Less origin restrictive for Youtube embed videos
SECURE_REFERRER_POLICY = "no-referrer-when-downgrade"

# CUSTOM SETTINGS
STAGING = env("STAGING")

# THIRD PARTY LIBRARIES SETTINGS

# Rest API settings
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "apps.utils.api_pagination.CustomPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_THROTTLE_RATES": {"anon": "50/day", "user": "1000/day"},
}

SILENCED_SYSTEM_CHECKS = ["rest_framework.W001"]

# Extra Settings
EXTRA_SETTINGS_CACHE_NAME = "extra_settings"

# Cripsy Forms
CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"
CRISPY_TEMPLATE_PACK = "bootstrap5"

# CKeditor config
CKEDITOR_5_CONFIGS = {
    "default": {
        "toolbar": [
            "heading",
            "|",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "fontColor",
            "fontBackgroundColor",
            "removeFormat",
            "|",
            "alignment",
            "bulletedList",
            "numberedList",
            "|",
            "code",
            "blockQuote",
            "|",
            "link",
            "imageUpload",
            "insertTable",
            "sourceEditing",
        ],
        "language": "fr",
        "image": {
            "toolbar": [
                "imageTextAlternative",
                "imageTitle",
                "|",
                "imageStyle:alignLeft",
                "imageStyle:full",
                "imageStyle:alignRight",
                "imageStyle:alignCenter",
                "imageStyle:side",
                "|",
            ],
            "styles": [
                "full",
                "side",
                "alignLeft",
                "alignRight",
                "alignCenter",
            ],
        },
        "link": {
            "addTargetToExternalLinks": True,  # open in new tab by default
            "defaultProtocol": "https://",  # add https when missing
        },
        "htmlSupport": {
            "allow": [
                {"name": "details", "classes": True, "styles": True},
                {"name": "summary", "classes": True, "styles": True},
                {"name": "div", "classes": True, "styles": True},
            ],
        },
    },
}

# Push notifications
PUSH_NOTIFICATIONS_SETTINGS = {
    "WP_PUBLIC_KEY": env("WP_PUBLIC_KEY"),
    "WP_PRIVATE_KEY": env("WP_PRIVATE_KEY"),
    "WP_CLAIMS": {"sub": "mailto:" + env("WP_ADMIN_EMAIL")},
}

SIMPLE_HISTORY_FILEFIELD_TO_CHARFIELD = True

# THIRD PARTY CONNEXIONS

# Discord
DISCORD_TOKEN = env("DISCORD_TOKEN")
DISCORD_CHANNEL_ID = env("DISCORD_CHANNEL_ID")
DISCORD_ADMIN_MODERATION_WEBHOOK = env("DISCORD_ADMIN_MODERATION_WEBHOOK")

# Github
GITHUB_USER = env("GITHUB_USER")
GITHUB_TOKEN = env("GITHUB_TOKEN")
GITHUB_REPO = "3cn-ecn/nantralPlatform"

# Mapbox
MAPBOX_API_KEY = env("MAPBOX_API_KEY")

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 7,
        },
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
]
