import json

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.urls.base import reverse
from django.views.generic import CreateView, DetailView, FormView, TemplateView

from extra_settings.models import Setting

from apps.account.models import User
from apps.account.serializers import EditUserSerializer
from apps.family.serializers import FamilyMembersSerializer
from apps.utils.access_mixins import UserIsAdmin

from .forms import (
    CreateFamilyForm,
    FamilyQuestionItiiForm,
    FamilyQuestionsForm,
    MemberQuestionsForm,
    UpdateFamilyForm,
)
from .models import (
    Family,
    MembershipFamily,
    QuestionPage,
)
from .utils import (
    get_membership,
    is_first_year,
    show_sensible_data,
)


class HomeFamilyView(LoginRequiredMixin, TemplateView):
    """Page d'accueil de l'appli Parrainage"""

    template_name = "family/home.html"

    def get_context_data(self, **kwargs):
        # by default all functions call data for the current year only
        user: User = self.request.user
        membership = get_membership(user)
        context = {
            "phase": Setting.get("PHASE_PARRAINAGE"),
            "is_2Aplus": not is_first_year(user, membership),
            "show_sensible_data": show_sensible_data(user, membership),
            "is_itii": user.faculty == "Iti",
            "membership": membership,
        }
        if membership:
            context["form_perso_complete"] = membership.form_complete()
            family = membership.group
            context["family"] = family
            if family:
                context["form_family_complete"] = family.form_complete()
                context["1A_members"] = family.memberships.filter(role="1A")
        context["ariane"] = [{"target": "#", "label": "Parrainage"}]
        return context


class ListFamilyView(LoginRequiredMixin, TemplateView):
    template_name = "family/list.html"

    def get_context_data(self, *args, **kwargs):
        phase = Setting.get("PHASE_PARRAINAGE")
        show_data = show_sensible_data(self.request.user)
        context = {
            "list_family": [
                {
                    "name": f.name if show_data else f"Famille n°{f.id}",
                    "url": f.get_absolute_url(),
                    "id": f.id,
                }
                for f in Family.objects.all()
            ]
        }
        memberships = MembershipFamily.objects.all().select_related(
            "user",
            "group",
        )
        if show_data:
            context["list_2A"] = [
                {
                    "name": m.user.alphabetical_name,
                    "family": m.group.name,
                    "url": m.group.get_absolute_url(),
                }
                for m in memberships.filter(role="2A+")
            ]
        if phase >= 3:  # noqa: PLR2004
            context["list_1A"] = [
                {
                    "name": m.user.alphabetical_name,
                    "family": (
                        m.group.name
                        if show_data and phase > 3  # noqa: PLR2004
                        else f"Famille n°{m.group.id}"
                    ),
                    "url": m.group.get_absolute_url(),
                }
                for m in memberships.filter(role="1A", group__isnull=False)
            ]
        context["ariane"] = [
            {"target": reverse("family:home"), "label": "Parrainage"},
            {"target": "#", "label": "Liste"},
        ]
        return context


class ListFamilyJoinView(ListFamilyView):
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        for family in context["list_family"]:
            family["url"] += "join"
        return context


class CreateFamilyView(LoginRequiredMixin, CreateView):
    """Vue pour créer une nouvelle famille"""

    template_name = "family/family/create.html"
    form_class = CreateFamilyForm

    def can_create(self):
        user: User = self.request.user
        return get_membership(user) is None and not is_first_year(user)

    def form_valid(self, form):
        if self.can_create():
            self.object = form.save()
            MembershipFamily.objects.create(
                group=self.object,
                user=self.request.user,
                role="2A+",
                admin=True,
            )
            return redirect("family:update", self.object.pk)
        else:
            return redirect("family:create")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["can_create"] = self.can_create()
        return context


class DetailFamilyView(LoginRequiredMixin, DetailView):
    template_name = "family/family/detail.html"

    def get_object(self):
        return Family.objects.get(pk=self.kwargs["pk"])

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        family = self.get_object()
        show_data = show_sensible_data(self.request.user)
        context["show_data"] = show_data
        context["is_admin"] = family.is_admin(self.request.user)
        context["parrains"] = family.memberships.filter(role="2A+")
        context["filleuls"] = family.memberships.filter(role="1A")
        context["phase"] = Setting.get("PHASE_PARRAINAGE")
        context["ariane"] = [
            {"target": reverse("family:home"), "label": "Parrainage"},
            {"target": reverse("family:family-list"), "label": "Liste"},
            {"target": "#", "label": family.name},
        ]
        return context


class JoinFamilyView(LoginRequiredMixin, DetailView):
    template_name = "family/family/join.html"

    def get_object(self):
        return Family.objects.get(pk=self.kwargs["pk"])

    def can_join(self):
        user: User = self.request.user
        return get_membership(user) is None and not is_first_year(user)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        family = self.get_object()
        context["can_join"] = self.can_join()
        non_subscribed_list = family.non_subscribed_members
        if non_subscribed_list:
            context["names_list"] = non_subscribed_list.split(",")
        return context

    def post(self, request, *args, **kwargs):
        if self.can_join():
            family = self.get_object()
            selected_name = request.POST["member"]
            names_list = family.non_subscribed_members.split(",")
            new_list = []
            for name in names_list:
                if name == selected_name:
                    MembershipFamily.objects.create(
                        user=request.user,
                        group=family,
                        role="2A+",
                        admin=True,
                    )
                else:
                    new_list.append(name)
            family.non_subscribed_members = ",".join(new_list)
            family.save()
            return redirect("family:home")
        else:
            return redirect("family:join", self.get_object().pk)


class UpdateFamilyView(UserIsAdmin, TemplateView):
    template_name = "family/family/edit.html"

    def get_family(self):
        return Family.objects.get(pk=self.kwargs["pk"])

    def test_func(self):
        self.kwargs["slug"] = self.get_family().slug
        return super().test_func()

    def get_members(self):
        users = (
            MembershipFamily.objects.filter(role="2A+", group=self.get_family())
            .order_by("pk")
            .values_list("user")
            .all()
        )

        return EditUserSerializer(
            instance=[
                User.objects.filter(pk=value[0]).first()
                for value in users
                if User.objects.filter(pk=value[0]).exists()
            ],
            many=True,
        ).data

    def get_context_data(self, *args, **kwargs):
        context = {}
        context["update_form"] = UpdateFamilyForm(instance=self.get_family())
        context["current_members"] = json.dumps(self.get_members())
        context["question_form"] = FamilyQuestionsForm(
            initial=self.get_family().get_answers_dict(),
        )
        context["errors"] = {}
        return context

    def post(self, request, *args, **kwargs):
        forms = [
            UpdateFamilyForm(request.POST, instance=self.get_family()),
            FamilyQuestionsForm(data=request.POST),
        ]

        serializer = FamilyMembersSerializer(
            data=request.POST, context={"family": self.get_family()}
        )
        error_dict = {}
        if not serializer.is_valid():
            for key, values in serializer.errors.items():
                error_dict[key] = [value[:] for value in values]

        if (
            forms[0].is_valid()
            and forms[1].is_valid()
            and serializer.is_valid()
        ):
            forms[0].save()
            serializer.save()
            forms[1].save(self.get_family())
            messages.success(
                request,
                "Les informations ont bien été enregistrées ! <a href='"
                + reverse("family:home")
                + "'>Compléter mon questionnaire perso</a>",
            )
            return redirect("family:update", self.get_family().pk)

        else:
            messages.error(request, "OOOOUPS !!! Il y a une erreur...")

        context = {
            "update_form": forms[0],
            "current_members": json.dumps(
                EditUserSerializer(
                    instance=[
                        User.objects.filter(pk=value).first()
                        for value in serializer.data.values()
                        if User.objects.filter(pk=value).exists()
                    ],
                    many=True,
                ).data
            ),
            "question_form": forms[1],
            "errors": json.dumps(error_dict),
        }
        return self.render_to_response(context)


class ItiiQuestionFamilyView(UserIsAdmin, TemplateView):
    template_name = "family/family/edit-itii.html"

    def get_family(self):
        return Family.objects.get(pk=self.kwargs["pk"])

    def test_func(self):
        self.kwargs["slug"] = self.get_family().slug
        return super().test_func()

    def get_context_data(self, *args, **kwargs):
        context = {}
        context["question_form"] = FamilyQuestionItiiForm()
        return context

    def post(self, request, *args, **kwargs):
        form = FamilyQuestionItiiForm(data=request.POST)
        if form.is_valid():
            form.save(self.get_family())
            messages.success(request, "Votre choix a bien été enregistré !")
            return redirect("family:home")
        context = {"question_form": form}
        return self.render_to_response(context)


class QuestionnaryPageView(LoginRequiredMixin, FormView):
    form_class = MemberQuestionsForm
    template_name = "family/forms/questionnary.html"

    def get_member(self):
        user: User = self.request.user
        membership = get_membership(user)
        if membership is None:
            if is_first_year(user):
                membership = MembershipFamily.objects.create(
                    user=self.request.user,
                    role="1A",
                )
            else:
                membership = None
        return membership

    def get_page(self):
        return QuestionPage.objects.get(order=self.kwargs["id"])

    def get_initial(self):
        self.intial = self.get_member().get_answers_dict(self.get_page())
        return self.intial

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update(
            {
                "page": self.get_page(),
                "is_2Aplus": self.get_member().role == "2A+",
            },
        )
        return kwargs

    def form_valid(self, form):
        form.save(self.get_member())
        try:
            next_page = QuestionPage.objects.get(
                order=self.get_page().order + 1,
            )
            return redirect("family:questionnary", next_page.order)
        except QuestionPage.DoesNotExist:
            messages.success(
                self.request,
                "🥳 Merci beaucoup ! Vos réponses ont bien été enregistrées !",
            )
            return redirect("family:home")

    def form_invalid(self, form):
        messages.error(self.request, "OOOOUPS !!! Il y a une erreur...")
        return super().form_invalid(form)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context["page"] = self.get_page()
        context["percent"] = int(
            100 * self.get_page().order / QuestionPage.objects.all().count(),
        )
        member = self.get_member()
        if member:
            context["is_2Aplus"] = member.role == "2A+"
        else:
            context["error"] = True
        return context
