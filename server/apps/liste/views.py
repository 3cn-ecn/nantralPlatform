from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Min
from datetime import date

from apps.liste.models import Liste


class ListListeView(LoginRequiredMixin, TemplateView):
    template_name = 'liste/list.html'

    def get_context_data(self, **kwargs):
        context = {'liste_list': [] }
        min_year = Liste.objects.all().aggregate(Min('year'))['year__min']
        max_year = date.today().year
        if min_year:
            for year in range(min_year, max_year+2):
                context['liste_list'].append({
                    'grouper': f'Campagnes {year-1}-{year}',
                    'list': Liste.objects.filter(year=year),
                })
        return context