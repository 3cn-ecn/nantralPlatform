import os
from typing import Any
from uuid import uuid4
from django.utils.deconstruct import deconstructible


@deconstructible
class PathAndRename(object):

    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        ext = filename.split('.')[-1]
        from apps.group.models import Group
        if isinstance(instance, Group):
            dir = os.path.join(self.path, instance.app)
        else:
            dir = self.path
        # get filename
        new_name = ''
        if try_to_get(instance, 'full_slug'):
            new_name = f'{instance.full_slug}.{ext}'
        elif try_to_get(instance, 'slug'):
            new_name = f'{instance.slug}.{ext}'
        elif try_to_get(instance, 'pk'):
            new_name = f'{instance.pk}.{ext}'
        else:
            new_name = f'{uuid4().hex}.{ext}'
        # return the whole path to the file
        return os.path.join(dir, new_name)


def try_to_get(object: Any, attribute: str):
    """Try to get an attribute and return null if the attribute does not exists. 

    Parameters
    ----------
    object : Any
        An object
    attribute : str
        The name of the attribute

    Returns
    -------
    value
        The value of attribute
    """
    try:
        return getattr(object, attribute)
    except Exception:
        return None
