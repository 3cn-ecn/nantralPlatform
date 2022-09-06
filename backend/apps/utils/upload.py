import os
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
        # get filename from a non-empty property
        new_name = ''
        if hasattr(instance, 'full_slug') and instance.full_slug:
            new_name = f'{instance.full_slug}.{ext}'
        elif hasattr(instance, 'slug') and instance.slug:
            new_name = f'{instance.slug}.{ext}'
        elif hasattr(instance, 'pk') and instance.pk:
            new_name = f'{instance.pk}.{ext}'
        else:
            new_name = f'{uuid4().hex}.{ext}'
        # return the whole path to the file
        return os.path.join(dir, new_name)
