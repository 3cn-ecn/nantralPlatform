from django.db import IntegrityError
from extra_settings.models import Setting



def update(name, value):
    """Update a setting directly, supposing it exists"""
    setting_obj = Setting.objects.get(name=name)
    setting_obj.value = value
    setting_obj.save()
        

def try_update(name, value):
    """Try to update a setting directly"""
    try:
        update(name, value)
    except Setting.DoesNotExist:
        print("Setting " + name + " does not exist")
        pass


def set(name, type, value):
    """Update or create the setting if it does not exist"""
    try:
        update(name, value)
    except Setting.DoesNotExist:
        setting_obj = Setting.objects.create(
            name = name,
            value_type = type,
        )
        setting_obj.value = value
        setting_obj.save()
