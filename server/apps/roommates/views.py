from typing import Any, Dict

from django.contrib.auth.mixins import LoginRequiredMixin
from apps.roommates.models import Housing, Roommates
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView, UpdateView, DetailView
import locale

from django.conf import settings

from apps.roommates.models import Housing


class HousingMap(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing_map.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['MAPBOX_API_KEY'] = settings.MAPBOX_API_KEY
        return context


class HousingDetailView(LoginRequiredMixin, DetailView):
    template_name = 'roommates/housing_detail.html'
    model = Housing
#{% for member, nickname, group in roommate.members.all %}
    def get_context_data(self, **kwargs):
        context= super().get_context_data(**kwargs)
        context['Roommates'] = Roommates.objects.filter( housing = self.object.pk).order_by('-end_date')
        
        #On met les dates en français et au bon format.
        locale.setlocale(locale.LC_TIME,'')
        for roommate in context['Roommates']:
            roommate.end_date= roommate.end_date.strftime('%d/%m/%Y')
            roommate.begin_date= roommate.begin_date.strftime('%d/%m/%Y')

        return context

        
class CreateHousingView(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing/create.html'


class EditHousingView(LoginRequiredMixin, UpdateView):
    template_name = 'roommates/housing/edit.html'
    model = Housing
    fields = ['details']
