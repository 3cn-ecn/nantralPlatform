from django.shortcuts import render, redirect
from django.views.generic import TemplateView, FormView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin

from apps.exchange.models import Exchange
from .forms import ExchangeForm

from django.contrib import messages

class ExchangeView(LoginRequiredMixin, TemplateView):
    template_name = 'exchange/exchange.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['exchanges'] = Exchange.objects.all()
        return context

class AddExchangeView(LoginRequiredMixin, FormView):
    template_name = 'exchange/add_exchange.html'
    form_class = ExchangeForm
    
    def dispatch(self,request, *args, **kwargs):
        try:
            self.request.user.student.exchange
            message = f'Vous avez déjà un échange. Modifiez-le ou supprimez-le.'
            messages.warning(self.request, message)
            return  redirect('exchange:exchange')
        except:
            return super(AddExchangeView,self).dispatch(request, *args,**kwargs)

    def form_valid(self, form):
        exchange = form.save(commit=False)
        exchange.student = self.request.user.student
        exchange.save()
        form.save_m2m()
        return redirect('exchange:exchange')

class UpdateExchangeView(LoginRequiredMixin, UpdateView):
    model = Exchange
    template_name = 'exchange/update_exchange.html'
    form_class = ExchangeForm
    success_url = "/exchange/"

class DeleteExchangeView(LoginRequiredMixin, DeleteView):
    model = Exchange
    template_name = 'exchange/delete_exchange.html'
    success_url = "/exchange/"
