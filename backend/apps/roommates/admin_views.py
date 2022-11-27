from django.views.generic import TemplateView
from extra_settings.models import Setting

from apps.utils.accessMixins import UserIsInGroup
from .models import Roommates

# group of users who have access
GROUP_NAME = 'admin-roommates'


class HomeAdminView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'roommates/admin/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['phase'] = Setting.get('PHASE_COLOCATHLON')
        # Colocathlon
        # Colocs - general
        colocs = Roommates.objects.filter(colocathlon_agree=True)
        context['nb_colocs'] = len(colocs)
        return context


class ResetView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = 'roommates/admin/reset.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        """ RESET ALL COLOCATHLON INFOS"""
        print("Delet infos about colocathlon")
        colocs = Roommates.objects.filter()
        for c in colocs:
            c.colocathlon_agree = False
            c.colocathlon_quota = 0
            c.colocathlon_hours = ""
            c.colocathlon_activities = ""
            c.colocathlon_participants.clear()
            c.save()
        return context
