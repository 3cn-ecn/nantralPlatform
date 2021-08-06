from django import template
import pathlib

register = template.Library()


@register.filter
def file_url(field):
    fname = pathlib.Path(field.path)
    if fname.exists():
        date = fname.stat().st_mtime
    else:
        date = ""
    return f'{field.url}?{date}'