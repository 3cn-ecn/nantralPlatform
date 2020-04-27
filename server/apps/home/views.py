from django.shortcuts import render
from django.views.generic import TemplateView
from urllib import parse
from ..utils.accessMixins import LoginRequiredAccessMixin

# Create your views here.
class HomeView(LoginRequiredAccessMixin, TemplateView):
    template_name = 'home/home.html'
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        if self.request.GET.get('message_type') is not None:
            message = {
                'type': self.request.GET.get('message_type'),
                'text': parse.unquote(self.request.GET.get('message_text'))
            }
            context['message'] = message
        return context
