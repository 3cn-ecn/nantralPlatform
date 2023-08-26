from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.sites.shortcuts import get_current_site
from django.http.request import HttpRequest
from django.shortcuts import redirect
from django.urls import resolve
from django.urls.base import reverse
from django.views.decorators.http import require_http_methods
from django.views.generic import DetailView, FormView, TemplateView, View

from apps.sociallink.models import SocialLink
from apps.utils.accessMixins import UserIsAdmin, user_is_connected
from apps.utils.slug import get_object_from_slug

from .forms import (
    AdminRightsRequest,
    AdminRightsRequestForm,
    NamedMembershipAddGroup,
    NamedMembershipGroupFormset,
    SocialLinkGroupFormset,
    UpdateGroupForm,
)
from .models import AbstractGroup


class BaseDetailGroupView(DetailView):
    """Vue de détails d'un groupe générique, sans protection."""

    template_name = "abstract_group/detail/detail.html"

    def get_object(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group = self.object
        # réseaux sociaux
        context["sociallinks"] = SocialLink.objects.filter(slug=group.full_slug)
        # seulement si connecté
        context["connected"] = user_is_connected(self.request.user)
        if user_is_connected(self.request.user):
            # members
            context["members"] = group.members.through.objects.filter(
                group=group
            ).order_by("student__user__first_name")
            context["is_member"] = group.is_member(self.request.user)
            if context["is_member"]:
                membership = group.members.through.objects.get(
                    student=self.request.user.student,
                    group=group,
                )
                context["form"] = NamedMembershipAddGroup(group)(
                    instance=membership
                )
            else:
                context["form"] = NamedMembershipAddGroup(group)()
            # admin
            context["is_admin"] = group.is_admin(self.request.user)
            context["admin_req_form"] = AdminRightsRequestForm()
        context["ariane"] = [
            {"target": reverse(group.app + ":index"), "label": group.app_name},
            {"target": "#", "label": group.name},
        ]
        return context


class DetailGroupView(LoginRequiredMixin, BaseDetailGroupView):
    """Vue de détail d'un groupe protégée."""

    pass


class AddToGroupView(LoginRequiredMixin, FormView):
    """Vue pour le bouton "Devenir Membre"."""

    raise_exception = True

    def get_group(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_form_class(self):
        group = self.get_group()
        self.form_class = NamedMembershipAddGroup(group)
        return NamedMembershipAddGroup(group)

    def get_form(self, form_class=None):
        if form_class is None:
            form_class = self.get_form_class()
        student = self.request.user.student
        group = self.get_group()
        membership = group.members.through.objects.filter(
            group=group, student=student
        ).first()
        return form_class(instance=membership, **self.get_form_kwargs())

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.student = self.request.user.student
        self.object.group = self.get_group()
        if not self.object.pk:
            self.object.save()
            messages.success(self.request, "Bienvenue dans le groupe !")
        elif self.request.POST.get("delete"):
            self.object.delete()
            messages.success(self.request, "Membre supprimé.")
        else:
            self.object.save()
            messages.success(
                self.request, "Les modifications ont bien été enregistrées !"
            )
        return redirect(self.object.group.get_absolute_url())

    def form_invalid(self, form):
        messages.error(self.request, "Modification refusée... 😥")
        return redirect(self.get_group().get_absolute_url())


class UpdateGroupView(UserIsAdmin, TemplateView):
    """Vue pour modifier les infos générales sur un groupe."""

    template_name = "abstract_group/edit/update.html"

    def get_object(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["object"] = self.get_object()
        group = self.get_object()
        UpdateForm = UpdateGroupForm(context["object"])  # noqa: N806
        if UpdateForm:
            context["form"] = UpdateForm(instance=context["object"])
        context["ariane"] = [
            {"target": reverse(group.app + ":index"), "label": group.app_name},
            {
                "target": reverse(
                    group.app + ":detail", kwargs={"slug": group.slug}
                ),
                "label": group.name,
            },
            {"target": "#", "label": "Modifier"},
        ]
        return context

    def post(self, request, **kwargs):
        group = self.get_object()
        UpdateForm = UpdateGroupForm(group)  # noqa: N806
        if UpdateForm:
            form = UpdateForm(request.POST, request.FILES, instance=group)
            if form.is_valid():
                form.save()
                messages.success(request, "Informations modifiées !")
            else:
                messages.error(request, form.errors)
        return redirect(group.app + ":update", group.slug)


class UpdateGroupMembersView(UserIsAdmin, TemplateView):
    """Vue pour modifier les membres d'un groupe."""

    template_name = "abstract_group/edit/members_edit.html"

    def get_object(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_context_data(self, **kwargs):
        context = {}
        group = self.get_object()
        context["object"] = group
        context["ariane"] = [
            {"target": reverse(group.app + ":index"), "label": group.app_name},
            {
                "target": reverse(
                    group.app + ":detail", kwargs={"slug": group.slug}
                ),
                "label": group.name,
            },
            {"target": "#", "label": "Modifier"},
        ]
        # memberships = context['object'].members.through.objects.filter(
        #     group=context['object'])
        # MembersFormset = NamedMembershipGroupFormset(
        #     context['object'])
        # if MembersFormset:
        #     context['members'] = MembersFormset(queryset=memberships)
        return context

    def post(self, request, **kwargs):
        group = self.get_object()
        return edit_named_memberships(request, group)


@require_http_methods(["POST"])
@login_required
def edit_named_memberships(request, group):
    MembersFormset = NamedMembershipGroupFormset(group)  # noqa: N806
    if MembersFormset:
        form = MembersFormset(request.POST)
        if form.is_valid():
            members = form.save(commit=False)
            for member in members:
                member.group = group
                member.save()
            for member in form.deleted_objects:
                member.delete()
            messages.success(request, "Membres modifiés")
        else:
            messages.error(request, form.errors)
    return redirect(group.app + ":update-members", group.slug)


class UpdateGroupSocialLinksView(UserIsAdmin, TemplateView):
    """Vue pour modifier les réseaux sociaux d'un groupe."""

    template_name = "abstract_group/edit/sociallinks_edit.html"

    def get_object(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_context_data(self, **kwargs):
        context = {}
        group = self.get_object()
        context["object"] = group
        sociallinks = SocialLink.objects.filter(
            slug=context["object"].full_slug
        )
        form = SocialLinkGroupFormset(queryset=sociallinks)
        context["sociallinks"] = form
        context["ariane"] = [
            {"target": reverse(group.app + ":index"), "label": group.app_name},
            {
                "target": reverse(
                    group.app + ":detail", kwargs={"slug": group.slug}
                ),
                "label": group.name,
            },
            {"target": "#", "label": "Modifier"},
        ]
        return context

    def post(self, request, **kwargs):
        group = self.get_object()
        return edit_sociallinks(request, group)


@require_http_methods(["POST"])
@login_required
def edit_sociallinks(request, group):
    form = SocialLinkGroupFormset(request.POST)
    if form.is_valid():
        sociallinks = form.save(commit=False)
        for sociallink in sociallinks:
            sociallink.slug = group.full_slug
            sociallink.save()
        for sociallink in form.deleted_objects:
            sociallink.delete()
        messages.success(request, "Liens modifiés")
    else:
        messages.error(request, form.errors)
    return redirect(group.app + ":update-sociallinks", group.slug)


class RequestAdminRightsView(LoginRequiredMixin, FormView):
    raise_exception = True
    form_class = AdminRightsRequestForm

    def get_group(self, **kwargs):
        app = resolve(self.request.path).app_name
        slug = self.kwargs.get("slug")
        return get_object_from_slug(app, slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["object"] = self.get_group()
        return context

    def form_valid(self, form):
        messages.success(
            self.request,
            (
                "Votre demande a bien été enregistrée ! Vous recevrez la réponse "
                "par mail."
            ),
        )
        object = form.save(commit=False)
        object.student = self.request.user.student
        object.group = self.get_group().full_slug
        object.save(domain=get_current_site(self.request).domain)
        return super().form_valid(form)

    def get_success_url(self) -> str:
        group = self.get_group()
        return reverse(group.app + ":detail", kwargs={"slug": group.slug})


class AcceptAdminRequestView(UserIsAdmin, View):
    def get(self, request: HttpRequest, slug, id):
        app = resolve(request.path_info).app_name
        group: AbstractGroup = get_object_from_slug(app, slug)
        try:
            admin_req: AdminRightsRequest = AdminRightsRequest.objects.get(
                id=id
            )
            if group.full_slug == admin_req.group:
                # Checking whether the url is legit
                messages.success(
                    request,
                    message=(
                        f"Vous avez accepté la demande de {admin_req.student}"
                    ),
                )
                admin_req.accept()
            else:
                messages.error(request, message="L'URL est invalide !!!")
        except AdminRightsRequest.DoesNotExist:
            messages.error(request, message="La demande a déjà été traitée !")
        return redirect(group.get_absolute_url())


class DenyAdminRequestView(UserIsAdmin, View):
    def get(self, request: HttpRequest, slug, id):
        app = resolve(request.path_info).app_name
        group: AbstractGroup = get_object_from_slug(app, slug)
        try:
            admin_req: AdminRightsRequest = AdminRightsRequest.objects.get(
                id=id
            )
            if group.full_slug == admin_req.group:
                # Checking whether the url is legit
                messages.success(
                    request,
                    message=(
                        f"Vous avez refusé la demande de {admin_req.student}"
                    ),
                )
                admin_req.deny()
            else:
                messages.error(request, message="L'URL est invalide !!!")
        except AdminRightsRequest.DoesNotExist:
            messages.error(request, message="La demande a déjà été traitée !")
        return redirect(group.get_absolute_url())
