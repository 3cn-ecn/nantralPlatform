from datetime import timedelta

# from django.contrib import messages
# from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
# from django.contrib.sites.shortcuts import get_current_site
# from django.db.utils import IntegrityError
# from django.http.request import HttpRequest
# from django.shortcuts import redirect
# from django.urls.base import reverse
# from django.urls import resolve
# from django.views.decorators.http import require_http_methods
from django.db.models import QuerySet
from django.views.generic import DetailView, ListView  # View, FormView, TemplateView
from django.utils import timezone

# from apps.group.abstract.models import AbstractGroup
from apps.sociallink.models import SocialLink
from apps.event.models import BaseEvent
from apps.post.models import Post
# from apps.notification.models import Subscription

# from .forms import (
#     NamedMembershipAddGroup,
#     NamedMembershipGroupFormset,
#     AdminRightsRequestForm,
#     UpdateGroupForm,
#     SocialLinkGroupFormset,
#     AdminRightsRequest)

from .models import Group, GroupType
from .forms import UpdateGroupForm, AddMembershipForm, MembershipFormset

# from apps.utils.accessMixins import UserIsAdmin, user_is_connected
# from apps.utils.slug import get_object_from_slug


class GroupTypeListView(ListView, LoginRequiredMixin):
    """List of GroupTypes view."""

    model = GroupType
    template_name = 'group/group_type_list.html'


class GroupListView(ListView, LoginRequiredMixin):
    """List of Groups view, filtered by group_type."""

    model = Group
    template_name = 'group/group_list.html'

    def get_queryset(self) -> QuerySet[Group]:
        return Group.objects.filter(group_type=self.kwargs.get('type'))

    def get_context_data(self, **kwargs) -> dict[str, any]:
        context = super().get_context_data(**kwargs)
        context['group_type'] = GroupType.objects.get(
            slug=self.kwargs.get('type'))
        return context


class GroupDetailView(DetailView, UserPassesTestMixin):
    """Main view for a group."""

    template_name = 'group/detail/detail.html'
    model = Group
    slug_field = 'slug'

    def test_func(self) -> bool:
        """Test if the user is allowed to see this view."""
        group: Group = self.get_object()
        user = self.request.user
        if group.public:
            return True
        elif group.private:
            return group.is_member(user)
        else:
            return user.is_authenticated

    def get_context_data(self, **kwargs):
        """Get the context data to send to the template."""
        context = super().get_context_data(**kwargs)
        group: Group = self.object
        user = self.request.user

        # hide sensitive data if not connected
        show_sensitive_data = user.is_authenticated
        context['show_sensitive_data'] = show_sensitive_data
        if show_sensitive_data:
            # show the posts from last 6 months (3 maximum)
            all_posts = Post.objects.filter(
                group=group.slug,
                publication_date__gte=timezone.now() - timedelta(days=6 * 30),
                publication_date__lte=timezone.now()
            ).order_by('-publication_date')
            context['posts'] = [p for p in all_posts if p.can_view(user)][:3]
            # check if there are some events planned for this group
            context['has_events'] = BaseEvent.objects.filter(
                group=group.slug,
                date__gte=timezone.now()
            ).exists()
            # members
            context['is_member'] = group.is_member(user)
            context['is_admin'] = group.is_admin(user)
            # member form
            if context['is_member']:
                membership = group.membership_set.get(
                    student=user.student,
                    group=group)
                context['form'] = AddMembershipForm(
                    group_type=group.group_type,
                    instance=membership)
            else:
                context['form'] = AddMembershipForm(group.group_type)
            # context['admin_req_form'] = AdminRightsRequestForm()
        context['ariane'] = [
            {
                'target': group.group_type.get_absolute_url(),
                'label': group.group_type.name
            },
            {
                'target': '#',
                'label': group.name
            },
        ]
        return context


# class AddToGroupView( , FormView):
#     '''Vue pour le bouton "Devenir Membre".'''

#     raise_exception = True

#     def get_group(self, **kwargs):
#         app = resolve(self.request.path).app_name
#         slug = self.kwargs.get("slug")
#         return get_object_from_slug(app, slug)

#     def get_form_class(self):
#         group = self.get_group()
#         self.form_class = NamedMembershipAddGroup(group)
#         return NamedMembershipAddGroup(group)

#     def get_form(self, form_class=None):
#         if form_class is None:
#             form_class = self.get_form_class()
#         student = self.request.user.student
#         group = self.get_group()
#         membership = group.members.through.objects.filter(
#             group=group, student=student).first()
#         return form_class(instance=membership, **self.get_form_kwargs())

#     def form_valid(self, form):
#         self.object = form.save(commit=False)
#         self.object.student = self.request.user.student
#         self.object.group = self.get_group()
#         if not self.object.pk:
#             self.object.save()
#             messages.success(self.request, 'Bienvenue dans le groupe !')
#             try:
#                 Subscription.objects.create(
#                     page=self.object.group.full_slug,
#                     student=self.object.student)
#             except IntegrityError:
#                 pass
#         elif self.request.POST.get('delete'):
#             self.object.delete()
#             messages.success(self.request, 'Membre supprimé.')
#             try:
#                 Subscription.objects.get(
#                     page=self.object.group.full_slug,
#                     student=self.object.student).delete()
#             except Subscription.DoesNotExist:
#                 pass
#         else:
#             self.object.save()
#             messages.success(
#                 self.request, 'Les modifications ont bien été enregistrées !')
#         return redirect(self.object.group.get_absolute_url())

#     def form_invalid(self, form):
#         messages.error(self.request, 'Modification refusée... 😥')
#         return redirect(self.get_group().get_absolute_url())


# class UpdateGroupView(UserIsAdmin, TemplateView):
#     '''Vue pour modifier les infos générales sur un groupe.'''

#     template_name = 'abstract_group/edit/update.html'

#     def get_object(self, **kwargs):
#         app = resolve(self.request.path).app_name
#         slug = self.kwargs.get("slug")
#         return get_object_from_slug(app, slug)

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['object'] = self.get_object()
#         group = self.get_object()
#         UpdateForm = UpdateGroupForm(context['object'])  # noqa: N806
#         if UpdateForm:
#             context['form'] = UpdateForm(instance=context['object'])
#         context['ariane'] = [{'target': reverse(group.app + ':index'),
#                               'label': group.app_name},
#                              {'target': reverse(group.app + ':detail',
#                                                 kwargs={'slug': group.slug}),
#                               'label': group.name},
#                              {'target': '#',
#                               'label': 'Modifier'}]
#         return context

#     def post(self, request, **kwargs):
#         group = self.get_object()
#         UpdateForm = UpdateGroupForm(group)  # noqa: N806
#         if UpdateForm:
#             form = UpdateForm(request.POST, request.FILES, instance=group)
#             if form.is_valid():
#                 form.save()
#                 messages.success(request, 'Informations modifiées !')
#             else:
#                 messages.error(request, form.errors)
#         return redirect(group.app + ':update', group.slug)


# class UpdateGroupMembersView(UserIsAdmin, TemplateView):
#     '''Vue pour modifier les membres d'un groupe.'''

#     template_name = 'abstract_group/edit/members_edit.html'

#     def get_object(self, **kwargs):
#         app = resolve(self.request.path).app_name
#         slug = self.kwargs.get("slug")
#         return get_object_from_slug(app, slug)

#     def get_context_data(self, **kwargs):
#         context = {}
#         group = self.get_object()
#         context['object'] = group
#         context['ariane'] = [{'target': reverse(group.app + ':index'),
#                               'label': group.app_name},
#                              {'target': reverse(group.app + ':detail',
#                                                 kwargs={'slug': group.slug}),
#                               'label': group.name},
#                              {'target': '#',
#                               'label': 'Modifier'}]
#         # memberships = context['object'].members.through.objects.filter(
#         #     group=context['object'])
#         # MembersFormset = NamedMembershipGroupFormset(
#         #     context['object'])
#         # if MembersFormset:
#         #     context['members'] = MembersFormset(queryset=memberships)
#         return context

#     def post(self, request, **kwargs):
#         group = self.get_object()
#         return edit_named_memberships(request, group)


# @ require_http_methods(['POST'])
# @ login_required
# def edit_named_memberships(request, group):
#     MembersFormset = NamedMembershipGroupFormset(group)  # noqa: N806
#     if MembersFormset:
#         form = MembersFormset(request.POST)
#         if form.is_valid():
#             members = form.save(commit=False)
#             for member in members:
#                 member.group = group
#                 member.save()
#             for member in form.deleted_objects:
#                 member.delete()
#             messages.success(request, 'Membres modifiés')
#         else:
#             messages.error(request, form.errors)
#     return redirect(group.app + ':update-members', group.slug)


# class UpdateGroupSocialLinksView(UserIsAdmin, TemplateView):
#     '''Vue pour modifier les réseaux sociaux d'un groupe.'''

#     template_name = 'abstract_group/edit/sociallinks_edit.html'

#     def get_object(self, **kwargs):
#         app = resolve(self.request.path).app_name
#         slug = self.kwargs.get("slug")
#         return get_object_from_slug(app, slug)

#     def get_context_data(self, **kwargs):
#         context = {}
#         group = self.get_object()
#         context['object'] = group
#         sociallinks = SocialLink.objects.filter(
#             slug=context['object'].full_slug)
#         form = SocialLinkGroupFormset(queryset=sociallinks)
#         context['sociallinks'] = form
#         context['ariane'] = [{'target': reverse(group.app + ':index'),
#                               'label': group.app_name},
#                              {'target': reverse(group.app + ':detail',
#                                                 kwargs={'slug': group.slug}),
#                               'label': group.name},
#                              {'target': '#',
#                               'label': 'Modifier'}]
#         return context

#     def post(self, request, **kwargs):
#         group = self.get_object()
#         return edit_sociallinks(request, group)


# @ require_http_methods(['POST'])
# @ login_required
# def edit_sociallinks(request, group):
#     form = SocialLinkGroupFormset(request.POST)
#     if form.is_valid():
#         sociallinks = form.save(commit=False)
#         for sociallink in sociallinks:
#             sociallink.slug = group.full_slug
#             sociallink.save()
#         for sociallink in form.deleted_objects:
#             sociallink.delete()
#         messages.success(request, 'Liens modifiés')
#     else:
#         messages.error(request, form.errors)
#     return redirect(group.app + ':update-sociallinks', group.slug)


# class RequestAdminRightsView(LoginRequiredMixin, FormView):
#     raise_exception = True
#     form_class = AdminRightsRequestForm

#     def get_group(self, **kwargs):
#         app = resolve(self.request.path).app_name
#         slug = self.kwargs.get("slug")
#         return get_object_from_slug(app, slug)

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['object'] = self.get_group()
#         return context

#     def form_valid(self, form):
#         messages.success(
#             self.request,
#             ('Votre demande a bien été enregistrée ! Vous recevrez la '
#              'réponse par mail.'))
#         object = form.save(commit=False)
#         object.student = self.request.user.student
#         object.group = self.get_group().full_slug
#         object.save(domain=get_current_site(self.request).domain)
#         return super().form_valid(form)

#     def get_success_url(self) -> str:
#         group = self.get_group()
#         return reverse(group.app + ':detail', kwargs={'slug': group.slug})


# class AcceptAdminRequestView(UserIsAdmin, View):
#     def get(self, request: HttpRequest, slug, id):
#         app = resolve(request.path_info).app_name
#         group: AbstractGroup = get_object_from_slug(app, slug)
#         try:
#             admin_req: AdminRightsRequest = AdminRightsRequest.objects.get(
#                 id=id)
#             if group.full_slug == admin_req.group:
#                 # Checking whether the url is legit
#                 messages.success(
#                     request,
#                     message=(
#                         "Vous avez accepté la demande "
#                         f"de {admin_req.student}"))
#                 admin_req.accept()
#             else:
#                 messages.error(request, message="L'URL est invalide !!!")
#         except AdminRightsRequest.DoesNotExist:
#             messages.error(
#                 request, message="La demande a déjà été traitée !")
#         return redirect(group.get_absolute_url())


# class DenyAdminRequestView(UserIsAdmin, View):
#     def get(self, request: HttpRequest, slug, id):
#         app = resolve(request.path_info).app_name
#         group: AbstractGroup = get_object_from_slug(app, slug)
#         try:
#             admin_req: AdminRightsRequest = AdminRightsRequest.objects.get(
#                 id=id)
#             if group.full_slug == admin_req.group:
#                 # Checking whether the url is legit
#                 messages.success(
#                     request,
#                     message=(
#                         "Vous avez refusé la demande "
#                         f" de {admin_req.student}"))
#                 admin_req.deny()
#             else:
#                 messages.error(request, message="L'URL est invalide !!!")
#         except AdminRightsRequest.DoesNotExist:
#             messages.error(
#                 request, message="La demande a déjà été traitée !")
#         return redirect(group.get_absolute_url())
