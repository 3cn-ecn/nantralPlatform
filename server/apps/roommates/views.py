from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from apps.roommates.models import Housing

class HousingMap(LoginRequiredMixin, TemplateView):
    template_name = 'roommates/housing_map.html'
