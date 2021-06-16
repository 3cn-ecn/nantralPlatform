from apps.club.models import BDX
from django import template

register = template.Library()

@register.inclusion_tag('club/show_navbar_bdx.html')
def show_navbar_bdx():
    a = BDX.objects.all()
    return {'bdx_list': a}