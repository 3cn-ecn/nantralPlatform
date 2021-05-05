from typing import Any, Dict

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from apps.roommates.models import Housing, Roommates
from django.views.generic.detail import DetailView #Ajouté par moi
from django.shortcuts import get_object_or_404

from django.conf import settings

class HousingMap(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing_map.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['MAPBOX_API_KEY'] = settings.MAPBOX_API_KEY
        return context


#Ajouté par moi
class HousingDetailView(LoginRequiredMixin, DetailView):
    template_name = 'roommates/housing_detail.html'
    model = Housing

    def get_context_data(self, **kwargs):
        context= super().get_context_data(**kwargs)
        context['Roommates'] = Roommates.objects.filter( housing = self.object.pk)
        
        return context