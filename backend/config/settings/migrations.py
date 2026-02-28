"""A special config for makemigrations to not migrate features
that were meant only for debug."""

# ruff: noqa: F403

from .dev_local import *

DEBUG = False
