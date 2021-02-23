from django.shortcuts import render, redirect
from django.views.generic import TemplateView, FormView, UpdateView, DeleteView
from ..utils.accessMixins import LoginRequiredAccessMixin

from apps.exchange.models import Exchange
from .forms import ExchangeForm

class ExchangeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'exchange/exchange.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['exchanges'] = Exchange.objects.all()
        return context

class AddExchangeView(LoginRequiredAccessMixin, FormView):
    template_name = 'exchange/add_exchange.html'
    form_class = ExchangeForm

    def form_valid(self, form):
        exchange = form.save(commit=False)
        exchange.student = self.request.user.student
        exchange.save()
        form.save_m2m()
        return redirect('exchange:exchange')

class UpdateExchangeView(LoginRequiredAccessMixin, UpdateView):
    model = Exchange
    template_name = 'exchange/update_exchange.html'
    form_class = ExchangeForm
    success_url = "/exchange/"

class DeleteExchangeView(LoginRequiredAccessMixin, DeleteView):
    model = Exchange
    template_name = 'exchange/delete_exchange.html'
    success_url = "/exchange/"
