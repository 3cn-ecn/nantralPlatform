# context processor for objects and
# variables needed in the navbar

from datetime import date

from apps.club.models import BDX
from apps.family.models import Affichage
from django.core.cache import cache


def navbar_context(request):
    """Loads context for the navbar."""
    bdx = cache.get('BDX')
    if not bdx:
        bdx = BDX.objects.all()
        cache.set('BDX', bdx, 10000)
    try:
        phase = Affichage.objects.first().phase
    except Exception:
        Affichage().save()
        phase = Affichage.objects.first().phase
    try:
        is_2A = request.user.student.promo < date.today().year
    except Exception:
        is_2A = False
    show = phase > 0 and (is_2A or date.today() >
                          date(date.today().year, 8, 30))
    return {'navbar_bdx': bdx, 'navbar_family_show': show}
