from django import template

register = template.Library()


@register.filter
def file_url(file):
    import pathlib
    fname = pathlib.Path(file.path)
    if fname.exists():
        date = fname.stat().st_mtime
    else:
        date = ""
    return f'{file.url}?{date}'