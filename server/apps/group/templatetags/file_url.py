from django import template
import os

register = template.Library()


@register.filter
def file_url(field):
    try:
        date = os.path.getmtime(field.path)
        return f'{field.url}?{date}'
    except Exception:
        return field.url