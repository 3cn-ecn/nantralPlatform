from django.shortcuts import render
from django.views.generic import TemplateView, FormView
from ..utils.accessMixins import LoginRequiredAccessMixin

from apps.exchange.models import Exchange

class ExchangeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'exchange/exchange.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['exchanges'] = Exchange.objects.all()
        return context
