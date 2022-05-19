from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Min
from django.core.cache import cache
from django.core.cache.utils import make_template_fragment_key
from django.utils import timezone

from apps.liste.models import Liste


class ListListeView(LoginRequiredMixin, TemplateView):
    template_name = 'liste/list.html'

    def get_context_data(self, **kwargs):
        context = {'liste_list': [] }
        key = make_template_fragment_key('liste_list')
        cached = cache.get(key)
        if cached is None:
            min_year = Liste.objects.all().aggregate(Min('year'))['year__min']
            max_year = timezone.now().today().year
            if min_year:
                for year in range(max_year+1, min_year-1, -1):
                    context['liste_list'].append({
                        'grouper': f'Campagnes {year-1}-{year}',
                        'list': Liste.objects.filter(year=year),
                    })
        context['ariane'] = [
            {
                'target': '#', 
                'label': 'Listes BDX'
            }
        ]
        return context