from typing import Any, Dict

from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView, UpdateView

from django.conf import settings

from apps.roommates.models import Housing


class HousingMap(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing_map.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['MAPBOX_API_KEY'] = settings.MAPBOX_API_KEY
        return context


class CreateHousingView(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing/create.html'


class EditHosuingView(LoginRequiredMixin, UpdateView):
    template_name = 'roommates/housing/edit.html'
    model = Housing
    fields = ['details']
