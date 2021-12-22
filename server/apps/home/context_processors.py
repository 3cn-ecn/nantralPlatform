# context processor for objects and
# variables needed in the navbar

# from datetime import date
# from django.core.cache import cache

# from apps.club.models import BDX
from apps.notification.models import SentNotification
# from apps.family.utils import read_phase


def navbar_context(request):
    """Loads context for the navbar."""
    # # BDX
    # bdx = cache.get('BDX')
    # if not bdx:
    #     bdx = BDX.objects.all()
    #     cache.set('BDX', bdx, 10000)
    # # Phase pour Parrainage
    # phase = read_phase()
    # if phase == 1:
    #     try:
    #         show = request.user.student.promo < date.today().year
    #     except Exception:
    #         show = False
    # else:
    #     show = (phase != 0)
    # notifications
    try:
        nbNotifs = SentNotification.objects.filter(
            student=request.user.student,
            subscribed=True,
            seen=False).count()
    except Exception:
        nbNotifs = 0
    return {'nbNotifs': nbNotifs}
