"""A module for using extraSettings.

An extra setting is a setting registered in the database, and editable
from the administration tool of Django.

Methods
-------
get(name: str) -> Any
    Get the value of a setting by its name
create(name: str, type: str, value: Any) -> None
    Create a new extra setting in the database, with a defaut value
update(name: str, value: Any) -> None
    Update a setting with a new value
get_or_create(name: str, type: str, default_value: Any) -> Any
    Get a setting by its name, or create it if it does not exist

Exceptions
----------
- UnknownSetting
- SettingAlreadyExists
"""

from typing import Any
from django.db import IntegrityError
from extra_settings.models import Setting


def get(name: str) -> Any:
    """Get the value of a setting by its name

    Parameters
    ----------
    name : str
        The name of the setting we want

    Returns
    -------
    value : Any
        The value of the setting

    Raises
    ------
    UnknownSetting
        Raised if the setting does not exists in the database
    """

    try:
        return Setting.objects.get(name=name).value
    except Setting.DoesNotExist:
        raise UnknownSetting(name)


def create(name: str, type: str, value: Any) -> None:
    """Create a new extra setting in the database, with a defaut value

    Parameters
    ----------
    name : str
        The name of the new setting
    type : str
        The type of the new setting, as a string. It can be one the following:
        'bool', 'date', 'datetime', 'decimal', 'duration', 'email', 'file', 
        'float', 'html', 'image', 'int', 'string', 'text', 'time', 'url'
    value : Any
        The value attributed to the new setting

    Raises
    ------
    SettingAlreadyExists
        Raised if the setting already exists in the database
    """

    try:
        obj = Setting.objects.create(name=name, value_type=type)
        obj.value = value
        obj.save()
    except IntegrityError:
        raise SettingAlreadyExists(name)


def update(name: str, value: Any) -> None:
    """Update a setting with a new value

    Parameters
    ----------
    name : str
        The name of the setting to update
    value : Any
        The new value of the setting

    Raises
    ------
    UnknownSetting
        Raised if the setting does not exists
    """

    try:
        setting_obj = Setting.objects.get(name=name)
        setting_obj.value = value
        setting_obj.save()
    except Setting.DoesNotExist:
        raise UnknownSetting(name)


def get_or_create(name: str, type: str, default_value: Any) -> Any:
    """Get a setting by its name, or create it if it does not exist

    Parameters
    ----------
    name : str
        The name of the setting
    type : str
        The type of the setting (see the create method for the list of
        available settings)
    default_value : Any
        The value to use if the setting does not exists

    Returns
    -------
    value : Any
        The value of the setting
    """

    try:
        return get(name)
    except UnknownSetting:
        create(name, type, default_value)
        return default_value


class UnknownSetting(Exception):
    """An exception class for unknown setting."""

    def __init__(self, name: str) -> None:
        message = f'The setting {name} does not exist in the database.'
        super().__init__(message)


class SettingAlreadyExists(Exception):
    """An exception class for already existing setting."""

    def __init__(self, name: str) -> None:
        message = f'The setting {name} already exists in the database.'
        super().__init__(message)
