# context processor for objects and 
# variables needed in the navbar

from apps.club.models import BDX
from apps.family.models import Affichage

def navbar_context(request):
	bdx = BDX.objects.all()
	try:
		phase = Affichage.objects.first().phase
	except Exception:
		Affichage().save()
		phase = Affichage.objects.first().phase
	return {'navbar_bdx': bdx, 'navbar_family_phase': phase}