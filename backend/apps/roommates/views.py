from enum import Enum
from typing import Any

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.urls import reverse
from django.views.generic import CreateView, ListView, TemplateView, UpdateView

from extra_settings.models import Setting

from apps.group.abstract.views import DetailGroupView, UpdateGroupView
from apps.utils.access_mixins import UserIsMember

from .forms import UpdateHousingForm
from .models import Housing, Roommates


class ColocathlonPhase(Enum):
    UNAVAILABLE = 0
    ROOMMATES_REGISTRATION = 1
    PARTICIPANTS_REGISTRATION = 2


class HousingMap(LoginRequiredMixin, TemplateView):
    template_name = "roommates/map.html"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context["MAPBOX_API_KEY"] = settings.MAPBOX_API_KEY
        colocathlon_phase_id = Setting.get("PHASE_COLOCATHLON")
        context["colocathlon"] = colocathlon_phase_id
        if (
            ColocathlonPhase(colocathlon_phase_id)
            == ColocathlonPhase.PARTICIPANTS_REGISTRATION
        ):
            roommate = Roommates.objects.filter(
                colocathlon_participants=self.request.user.student,
            ).first()
            if roommate:
                context["CURRENT_COLOC"] = roommate.name
                context["CURRENT_COLOC_URL"] = roommate.get_absolute_url()
        context["ariane"] = [
            {"target": "#", "label": "Colocs"},
            {"target": "#", "label": "Carte"},
        ]
        return context


class HousingList(LoginRequiredMixin, ListView):
    model = Housing
    template_name = "roommates/list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["ariane"] = [
            {"target": reverse("roommates:housing-map"), "label": "Colocs"},
            {"target": "#", "label": "Liste"},
        ]
        return context


class CreateHousingView(LoginRequiredMixin, TemplateView):
    template_name = "roommates/create/create-housing.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["ariane"] = [
            {"target": reverse("roommates:index"), "label": "Colocs"},
            {"target": "#", "label": "Créer une coloc"},
        ]
        return context


class CreateRoommatesView(LoginRequiredMixin, CreateView):
    template_name = "roommates/create/create-roommates.html"
    model = Roommates
    fields = ["name", "begin_date", "end_date"]

    def form_valid(self, form):
        form.instance.housing = Housing.objects.get(
            pk=self.kwargs["housing_pk"],
        )
        roommates = form.save()
        roommates.members.add(self.request.user.student)
        member = roommates.members.through.objects.get(
            student=self.request.user.student,
            group=roommates,
        )
        member.admin = True
        member.save()
        return redirect("roommates:detail", roommates.slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["ariane"] = [
            {"target": reverse("roommates:index"), "label": "Colocs"},
            {"target": "#", "label": "Créer une coloc"},
        ]
        return context


class ColocathlonFormView(UserIsMember, UpdateView):
    template_name = "roommates/coloc/edit/colocathlon.html"
    model = Roommates
    fields = [
        "colocathlon_agree",
        "colocathlon_quota",
        "colocathlon_hours",
        "colocathlon_activities",
    ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group = self.get_object()
        context["ariane"] = [
            {"target": reverse(group.app + ":index"), "label": group.app_name},
            {
                "target": reverse(
                    group.app + ":detail",
                    kwargs={"slug": group.slug},
                ),
                "label": group.name,
            },
            {"target": "#", "label": "Colocathlon"},
        ]
        return context


class DetailRoommatesView(DetailGroupView):
    """Vue de détails d'une coloc."""

    template_name = "roommates/coloc/detail/detail.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["housing"] = self.object.housing
        context["roommates_list"] = (
            Roommates.objects.filter(housing=context["housing"])
            .exclude(pk=self.object.pk)
            .order_by("-begin_date")
        )
        context["colocathlon"] = Setting.get("PHASE_COLOCATHLON")
        context["nb_participants"] = (
            self.object.colocathlon_participants.count()
        )
        return context


class UpdateRoommatesView(UpdateGroupView):
    """Vue pour modifier les infos générales sur une coloc."""

    template_name = "roommates/coloc/edit/update.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form_housing"] = UpdateHousingForm(
            instance=context["object"].housing,
        )
        return context

    def post(self, request, **kwargs):
        group = self.get_object()
        form_housing = UpdateHousingForm(
            request.POST,
            request.FILES,
            instance=group.housing,
        )
        form_housing.save()
        return super().post(request, **kwargs)
