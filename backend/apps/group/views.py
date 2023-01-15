from datetime import timedelta

# from django.contrib.auth.decorators import login_required
# from django.contrib.sites.shortcuts import get_current_site
# from django.db.utils import IntegrityError
# from django.urls import resolve
# from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import QuerySet
from django.http import HttpResponse  # , HttpRequest
from django.shortcuts import redirect
from django.urls.base import reverse
from django.utils import timezone
from django.views.generic import DetailView, ListView, FormView, View

from discord_webhook import DiscordWebhook, DiscordEmbed

# from apps.group.abstract.models import AbstractGroup
# from apps.sociallink.models import SocialLink
from apps.event.models import BaseEvent
from apps.post.models import Post

# from .forms import (
#     NamedMembershipAddGroup,
#     NamedMembershipGroupFormset,
#     AdminRightsRequestForm,
#     UpdateGroupForm,
#     SocialLinkGroupFormset,
#     AdminRightsRequest)

from .models import GroupType, Group
from .forms import MembershipForm, AdminRequestForm

# from apps.utils.accessMixins import UserIsAdmin, user_is_connected
# from apps.utils.slug import get_object_from_slug


class GroupTypeListView(ListView, LoginRequiredMixin):
    """List of GroupTypes."""

    model = GroupType
    template_name = 'group/group_type_list.html'

    def get_context_data(self, **kwargs) -> dict[str, any]:
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#',
                'label': "Groupes"
            }
        ]
        return context


class GroupListView(ListView, LoginRequiredMixin):
    """List of Groups, filtered by type."""

    template_name = 'group/group_list.html'

    def get_queryset(self) -> QuerySet[Group]:
        category_field = (
            GroupType.objects
            .get(slug=self.kwargs.get('type'))
            .category_field)
        return (Group.objects
                .filter(group_type=self.kwargs.get('type'))
                .prefetch_related('group_type', 'parent')
                .order_by(category_field, 'order', 'short_name'))

    def get_context_data(self, **kwargs) -> dict[str, any]:
        context = super().get_context_data(**kwargs)
        group_type = GroupType.objects.get(slug=self.kwargs.get('type'))
        context['group_type'] = group_type
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': "Groupes"
            },
            {
                'target': '#',
                'label': group_type.name
            }
        ]
        return context


class GroupDetailView(DetailView, UserPassesTestMixin):
    """The page for details on a group."""

    template_name = 'group/detail.html'
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

        if user.is_authenticated:
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
            context['has_subscribed'] = group.subscribers.contains(user.student)
            # member form
            if context['is_member']:
                membership = group.membership_set.get(
                    student=user.student,
                    group=group)
                context['member_form'] = MembershipForm(instance=membership)
                context['admin_form'] = AdminRequestForm(instance=membership)
            else:
                context['member_form'] = MembershipForm(group, user.student)
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': "Groupes"
            },
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


class UpdateSubscriptionView(View):
    """Call this view to subscribe to a group, or unsubscribe if the user has
    already subscribed."""

    def get(self, request, slug) -> HttpResponse:
        group = Group.objects.get(slug=slug)
        student = request.user.student
        if group.subscribers.contains(student):
            group.subscribers.remove(student)
        else:
            group.subscribers.add(student)
        return redirect(group.get_absolute_url())


class MembershipFormView(FormView, LoginRequiredMixin):
    """View for the user to add himself as a member of a group."""

    http_method_names = ['post']

    def get_group(self) -> Group:
        if not hasattr(self, 'group'):
            self.group = Group.objects.get(slug=self.kwargs.get('slug'))
        return self.group

    def get_form(self) -> MembershipForm:
        return MembershipForm(
            group=self.get_group(),
            student=self.request.user.student,
            instance=(self.get_group()
                      .membership_set
                      .filter(student=self.request.user.student)
                      .first()),
            **self.get_form_kwargs())

    def form_valid(self, form: MembershipForm) -> HttpResponse:
        student = self.request.user.student
        if self.request.POST.get('delete'):
            # delete the membership
            self.get_group().subscribers.remove(student)
            form.instance.delete()
            messages.success(self.request, 'Membre supprimé.')
        else:
            # create or update the membership
            created = form.instance.pk is None
            form.save()
            if created:
                self.get_group().subscribers.add(student)
                messages.success(self.request, 'Bienvenue dans le groupe !')
            else:
                messages.success(
                    self.request,
                    'Les modifications ont bien été enregistrées !')
        # return to the page
        return redirect(self.get_group().get_absolute_url())

    def form_invalid(self, form: MembershipForm):
        messages.error(self.request, 'Modification refusée... 😥')
        return redirect(self.get_group().get_absolute_url())


class AdminRequestFormView(FormView, LoginRequiredMixin):
    """View for ask for admin rights."""

    http_method_names = ['post']

    def get_group(self) -> Group:
        if not hasattr(self, 'group'):
            self.group = Group.objects.get(slug=self.kwargs.get('slug'))
        return self.group

    def get_form(self) -> AdminRequestForm:
        return AdminRequestForm(
            instance=(self.get_group()
                      .membership_set
                      .get(student=self.request.user.student)),
            **self.get_form_kwargs())

    def form_valid(self, form: AdminRequestForm) -> HttpResponse:
        membership = form.save()
        messages.success(
            self.request,
            ("Votre demande a bien été enregistrée ! Vous recevrez la "
             "réponse par mail."))
        # send a message to the discord channel for administrators
        accept_url = self.request.build_absolute_uri(
            reverse('group:accept-admin-req', kwargs={'member': membership.id}))
        deny_url = self.request.build_absolute_uri(
            reverse('group:deny-admin-req', kwargs={'member': membership.id}))
        webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(f"{membership.student} ({membership.summary}) demande à "
                   f"devenir admin de {membership.group}"),
            description=membership.admin_request_messsage,
            color=242424)
        embed.add_embed_field(
            name='Accepter', value=f"[Accepter]({accept_url})", inline=True)
        embed.add_embed_field(
            name='Refuser', value=f"[Refuser]({deny_url})", inline=True)
        if membership.student.picture:
            embed.thumbnail = {"url": membership.student.picture.url}
        webhook.add_embed(embed)
        webhook.execute()
        return redirect(self.get_group().get_absolute_url())

    def form_invalid(self, form: AdminRequestForm):
        messages.error(self.request, "Une erreur s'est produit... 😥")
        return redirect(self.get_group().get_absolute_url())


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
