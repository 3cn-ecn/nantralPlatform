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
        # get filename
        try:
            filename = f'{instance.full_slug}.{ext}'
        except AttributeError:
            try:
                filename = f'{instance.pk}.{ext}'
            except AttributeError:
                # set filename as random string
                filename = f'{uuid4().hex}.{ext}'
        # return the whole path to the file
        return os.path.join(dir, filename)
