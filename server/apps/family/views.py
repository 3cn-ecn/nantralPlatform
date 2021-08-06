from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from datetime import date

# Create your views here.

class HomeFamily(LoginRequiredMixin, TemplateView):
    """Page d'accueil de l'appli Parrainage"""

    template_name = 'family/home.html'

    def get_context_data(self, **kwargs):
        context = {}
        context['user_promo'] = self.request.user.student.promo
        context['user_family'] = self.request.user.student.family.first()
        context['is_mentor'] = (context['user_promo'] < date.today().year)
        
        return context