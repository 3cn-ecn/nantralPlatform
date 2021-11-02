"""A special config for makemigrations to not migrate features
that were meant only for debug."""
from .dev_local import *  # noqa: F403, F401

DEBUG = False
