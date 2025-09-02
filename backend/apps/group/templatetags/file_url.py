from django import template

register = template.Library()


@register.filter
def file_url(field):
    try:
        return f"{field.url}?{field.file.size}"
    except BaseException:
        return field.url
