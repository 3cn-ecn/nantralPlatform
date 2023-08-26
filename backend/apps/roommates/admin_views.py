from django.views.generic import TemplateView

from extra_settings.models import Setting

from apps.utils.accessMixins import UserIsInGroup

from .models import Roommates

# group of users who have access
GROUP_NAME = "admin-roommates"


class HomeAdminView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = "roommates/admin/home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["phase"] = Setting.get("PHASE_COLOCATHLON")
        # Colocathlon
        # Colocs - general
        nb_participants = 0
        participants = Roommates.objects.filter(colocathlon_agree=True)
        context["nb_colocs"] = len(participants)
        colocs_liste = []
        for participant in participants:
            coloc = {}
            coloc["name"] = participant.name
            coloc["quota"] = participant.colocathlon_quota
            membres = list(participant.colocathlon_participants.all())
            coloc["places"] = len(membres)
            nb_participants += coloc["places"]
            coloc["membres"] = [membre.name for membre in membres]
            colocs_liste.append(coloc)
        context["nb_participants"] = nb_participants
        context["colocs"] = colocs_liste
        return context


class ResetView(UserIsInGroup, TemplateView):
    group = GROUP_NAME
    template_name = "roommates/admin/reset.html"

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
