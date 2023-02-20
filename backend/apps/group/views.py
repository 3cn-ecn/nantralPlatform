from datetime import timedelta

from django.conf import settings
from django.contrib import messages
from django.http import HttpResponse, HttpRequest
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import QuerySet, Q, Count
from django.shortcuts import redirect, get_object_or_404
from django.urls.base import reverse
from django.utils import timezone
from django.utils.translation import gettext as _
from django.views.generic import (
    CreateView,
    DeleteView,
    DetailView,
    FormView,
    ListView,
    TemplateView,
    UpdateView,
    View)

from discord_webhook import DiscordWebhook, DiscordEmbed

from apps.event.models import BaseEvent
from apps.post.models import Post

from .models import GroupType, Group, Membership
from .forms import (
    MembershipForm,
    AdminRequestForm,
    UpdateGroupForm,
    SocialLinkGroupFormset)


class UserCanSeeGroupMixin(UserPassesTestMixin):
    """A mixin class to test if a user has the rights to see a group."""

    def test_func(self) -> bool:
        group = Group.objects.get(slug=self.kwargs.get('slug'))
        user = self.request.user
        if group.public:
            # public group: everyone can see
            return True
        elif group.private:
            # private group: only members (and admins of course)
            return group.is_member(user) or user.is_superuser
        else:
            # normal group: every authenticated users
            return user.is_authenticated


class UserIsGroupAdminMixin(UserPassesTestMixin):
    """A mixin class to test if a user has the rights to see a group."""

    def test_func(self) -> bool:
        try:
            group = Group.objects.get(slug=self.kwargs.get('slug'))
            user = self.request.user
            return group.is_admin(user)
        except Group.DoesNotExist:
            return self.request.user.is_superuser


class ListGroupTypeView(ListView, LoginRequiredMixin):
    """List of GroupTypes."""

    model = GroupType
    template_name = 'group/group_type_list.html'
    # ordering = ['-order', 'name']

    def get_context_data(self, **kwargs) -> dict[str, any]:
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': '#',
                'label': _("Groups")
            }
        ]
        return context


class ListGroupView(ListView):
    """List of Groups, filtered by type."""

    template_name = 'group/group_list.html'

    def get_queryset(self) -> QuerySet[Group]:
        user = self.request.user
        group_type = get_object_or_404(GroupType, slug=self.kwargs.get('type'))
        return (Group.objects
                # filter by group_type
                .filter(group_type=group_type)
                # remove the sub-groups to keep only parent groups
                .filter(Q(parent=None)
                        | Q(parent__in=group_type.extra_parents.all()))
                # hide archived groups
                .filter(archived=False)
                # hide private groups unless user is member
                # and hide non-public group if user is not authenticated
                .filter(Q(private=False) | Q(members=user.student)
                        if user.is_authenticated
                        else Q(public=True))
                # hide groups without active members (ie end_date > today)
                .annotate(num_active_members=Count(
                    'membership_set',
                    filter=Q(membership_set__end_date__gte=timezone.now())))
                .filter(Q(num_active_members__gt=0)
                        if group_type.hide_no_active_members
                        else Q())
                # prefetch type and parent group for better performances
                .prefetch_related('group_type', 'parent')
                # order by category, order and then name
                .order_by(*group_type.sort_fields.split(',')))

    def get_context_data(self, **kwargs) -> dict[str, any]:
        context = super().get_context_data(**kwargs)
        group_type = GroupType.objects.get(slug=self.kwargs.get('type'))
        context['group_type'] = group_type
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': '#',
                'label': group_type.name
            }
        ]
        return context


class DetailGroupView(UserCanSeeGroupMixin, DetailView):
    """The page for details on a group."""

    template_name = 'group/detail.html'
    model = Group
    slug_field = 'slug'

    def get_context_data(self, **kwargs):
        """Get the context data to send to the template."""
        context = super().get_context_data(**kwargs)
        group: Group = self.object
        user = self.request.user

        if user.is_authenticated:
            # show the posts from last 6 months (3 maximum)
            all_posts = Post.objects.filter(
                group_slug=group.slug,
                publication_date__gte=timezone.now() - timedelta(days=6 * 30),
                publication_date__lte=timezone.now()
            ).order_by('-publication_date')
            context['posts'] = [p for p in all_posts if p.can_view(user)][:3]
            # check if there are some events planned for this group
            context['has_events'] = BaseEvent.objects.filter(
                group_slug=group.slug,
                date__gte=timezone.now()
            ).exists()
            # members
            context['is_member'] = group.is_member(user)
            context['is_admin'] = group.is_admin(user)
            context['has_subscribed'] = group.subscribers.contains(user.student)
            # member form
            if context['is_member']:
                context['has_requested_admin'] = (
                    group.membership_set.get(student__user=user).admin_request)
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
                'label': _("Groups")
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


class ListGroupChildrenView(ListView):
    """List of Groups, filtered by type."""

    template_name = 'group/children_list.html'

    def get_queryset(self) -> QuerySet[Group]:
        user = self.request.user
        parent = get_object_or_404(Group, slug=self.kwargs.get('slug'))
        return (Group.objects
                # remove the sub-groups to keep only parent groups
                .filter(parent=parent)
                # hide archived groups
                .filter(archived=False)
                # hide private groups unless user is member
                # and hide non-public group if user is not authenticated
                .filter(Q(private=False) | Q(members=user.student)
                        if user.is_authenticated
                        else Q(public=True))
                # prefetch type and parent group for better performances
                .prefetch_related('group_type', 'parent')
                # order by category, order and then name
                .order_by('order', 'short_name'))

    def get_context_data(self, **kwargs) -> dict[str, any]:
        context = super().get_context_data(**kwargs)
        parent = Group.objects.get(slug=self.kwargs.get('slug'))
        context['parent'] = parent
        context['is_admin'] = parent.is_admin(self.request.user)
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': parent.group_type.get_absolute_url(),
                'label': parent.group_type.name
            },
            {
                'target': parent.get_absolute_url(),
                'label': parent.name
            },
            {
                'target': '#',
                'label': parent.children_label
            }
        ]
        return context


class UpdateGroupView(UserIsGroupAdminMixin, UpdateView):
    """Edit general data of a group."""

    template_name = 'group/edit/update.html'
    form_class = UpdateGroupForm
    model = Group

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.object.group_type.get_absolute_url(),
                'label': self.object.group_type.name
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.name
            },
            {
                'target': '#',
                'label': _("Edit")
            }
        ]
        return context


class DeleteGroupView(UserIsGroupAdminMixin, DeleteView):
    """Delete a group."""

    template_name = 'group/edit/delete.html'
    model = Group
    slug_field = 'slug'

    def get_success_url(self) -> str:
        return self.object.group_type.get_absolute_url()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.object.group_type.get_absolute_url(),
                'label': self.object.group_type.name
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.name
            },
            {
                'target': '#',
                'label': _("Edit")
            }
        ]
        return context


class CreateGroupView(UserPassesTestMixin, CreateView):
    """Create a group"""

    template_name = 'group/edit/create.html'
    model = Group
    fields = ['name', 'short_name', 'summary', 'description', 'meeting_place',
              'meeting_hour', 'icon', 'banner', 'video1', 'video2', 'public']

    def test_func(self) -> bool:
        self.group_type = get_object_or_404(GroupType, slug=self.kwargs['type'])
        self.parent = Group.objects.filter(
            slug=self.request.GET.get('parent', None)).first()
        return (self.request.user.is_superuser
                or self.group_type.can_create
                or self.parent and self.parent.is_admin(self.request.user))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.group_type.get_absolute_url(),
                'label': self.group_type.name
            },
            {
                'target': '#',
                'label': _("Create")
            }
        ]
        return context

    def get_form(self, form_class=None):
        form = super().get_form(form_class)
        form.instance.group_type = self.group_type
        form.instance.parent = self.parent
        return form

    def form_valid(self, form):
        if self.group_type.is_year_group:
            # We add by default the current year.
            # The change of year is placed on 1st July.
            form.instance.year = (
                timezone.now().year - int(timezone.now().month < 7))
        res = super().form_valid(form)
        if not self.parent:
            form.instance.members.add(
                self.request.user.student,
                through_defaults={'admin': True})
        return res


class UpdateGroupMembershipsView(UserIsGroupAdminMixin, TemplateView):
    """Vue pour modifier les membres d'un groupe."""

    template_name = 'group/edit/members.html'

    def get_object(self, **kwargs):
        return Group.objects.get(slug=self.kwargs.get('slug'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
        context['group'] = self.object
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.object.group_type.get_absolute_url(),
                'label': self.object.group_type.name
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.name
            },
            {
                'target': '#',
                'label': _("Edit")
            }
        ]
        return context


class UpdateGroupSocialLinksView(UserIsGroupAdminMixin, TemplateView):
    '''Vue pour modifier les réseaux sociaux d'un groupe.'''

    template_name = 'group/edit/sociallinks.html'

    def get_object(self, **kwargs):
        return Group.objects.get(slug=self.kwargs.get('slug'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
        context['group'] = self.object
        form = SocialLinkGroupFormset(queryset=self.object.social_links.all())
        context['sociallinks'] = form
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.object.group_type.get_absolute_url(),
                'label': self.object.group_type.name
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.name
            },
            {
                'target': '#',
                'label': _("Edit")
            }
        ]
        return context

    def post(self, request, **kwargs):
        group = self.get_object()
        form = SocialLinkGroupFormset(request.POST)
        if form.is_valid():
            sociallinks = form.save(commit=False)
            for sociallink in sociallinks:
                sociallink.save()
                group.social_links.add(sociallink)
            for sociallink in form.deleted_objects:
                sociallink.delete()
            messages.success(request, _("Social links updated"))
        else:
            messages.error(request, form.errors)
        return redirect('group:update-sociallinks', group.slug)


class UpdateGroupChildrenView(UserIsGroupAdminMixin, TemplateView):
    """Vue pour modifier les groups enfants d'un groupe."""

    template_name = 'group/edit/children.html'

    def get_object(self, **kwargs):
        return Group.objects.get(slug=self.kwargs.get('slug'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
        context['group'] = self.object
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.object.group_type.get_absolute_url(),
                'label': self.object.group_type.name
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.name
            },
            {
                'target': '#',
                'label': _("Edit")
            }
        ]
        return context


class UpdateGroupEventsView(UserIsGroupAdminMixin, TemplateView):
    """Vue pour modifier les membres d'un groupe."""

    template_name = 'group/edit/events.html'

    def get_object(self, **kwargs):
        return Group.objects.get(slug=self.kwargs.get('slug'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
        context['group'] = self.object
        context['events'] = (BaseEvent.objects
                             .filter(group_slug=self.object.slug)
                             .order_by('-date'))
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.object.group_type.get_absolute_url(),
                'label': self.object.group_type.name
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.name
            },
            {
                'target': '#',
                'label': _("Edit")
            }
        ]
        return context


class UpdateGroupPostsView(UserIsGroupAdminMixin, TemplateView):
    """Vue pour modifier les membres d'un groupe."""

    template_name = 'group/edit/posts.html'

    def get_object(self, **kwargs):
        return Group.objects.get(slug=self.kwargs.get('slug'))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        self.object = self.get_object()
        context['group'] = self.object
        context['posts'] = (Post.objects
                            .filter(group_slug=self.object.slug)
                            .order_by('-publication_date'))
        context['ariane'] = [
            {
                'target': reverse('group:index'),
                'label': _("Groups")
            },
            {
                'target': self.object.group_type.get_absolute_url(),
                'label': self.object.group_type.name
            },
            {
                'target': self.object.get_absolute_url(),
                'label': self.object.name
            },
            {
                'target': '#',
                'label': _("Edit")
            }
        ]
        return context


class UpdateSubscriptionView(UserCanSeeGroupMixin, View):
    """
    SUBSCRIBE BUTTON: call this view to subscribe to a group, or unsubscribe
    if the user has already subscribed.
    """

    def get(self, request, slug) -> HttpResponse:
        group = Group.objects.get(slug=slug)
        student = request.user.student
        if group.subscribers.contains(student):
            group.subscribers.remove(student)
        else:
            group.subscribers.add(student)
        return redirect(group.get_absolute_url())


class MembershipFormView(UserCanSeeGroupMixin, FormView):
    """
    MEMBERSHIP BUTTON: View for the user to add himself as a member of a group,
    and to edit its membership.
    """

    http_method_names = ['post']

    @property
    def group(self) -> Group:
        if not hasattr(self, '_group'):
            self._group = Group.objects.get(slug=self.kwargs.get('slug'))
        return self._group

    def get_form(self) -> MembershipForm:
        return MembershipForm(
            group=self.group,
            student=self.request.user.student,
            instance=(self.group.membership_set
                      .filter(student=self.request.user.student)
                      .first()),
            **self.get_form_kwargs())

    def form_valid(self, form: MembershipForm) -> HttpResponse:
        student = self.request.user.student
        if self.request.POST.get('delete'):
            # delete the membership
            self.group.subscribers.remove(student)
            form.instance.delete()
            messages.success(self.request, _(
                "You are no longer a member of this group."))
        else:
            # create or update the membership
            created = form.instance.pk is None
            form.save()
            if created:
                self.group.subscribers.add(student)
                messages.success(self.request, _("Welcome in the group!"))
            else:
                messages.success(self.request, _(
                    "Your modifications have been saved!"))
        # return to the page
        return redirect(self.group.get_absolute_url())

    def form_invalid(self, form: MembershipForm):
        messages.error(self.request, _("Modifications failed... 😥"))
        return redirect(self.group.get_absolute_url())


class AdminRequestFormView(UserCanSeeGroupMixin, FormView):
    """ADMIN BUTTON: View to ask for admin rights."""

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
        messages.success(self.request, _(
            "Your admin request has been sent! You will receive the answer "
            "soon by email."))
        # send a message to the discord channel for administrators
        accept_url = self.request.build_absolute_uri(
            reverse('group:accept-admin-req', kwargs={'id': membership.id}))
        deny_url = self.request.build_absolute_uri(
            reverse('group:deny-admin-req', kwargs={'id': membership.id}))
        webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(f"{membership.student} demande à "
                   f"devenir admin de {membership.group.short_name}"),
            description=membership.admin_request_messsage,
            color=242424)
        embed.add_embed_field(
            name='Accepter', value=f"[Accepter]({accept_url})", inline=True)
        embed.add_embed_field(
            name='Refuser', value=f"[Refuser]({deny_url})", inline=True)
        # if membership.student.picture:
        #     embed.thumbnail = {"url": membership.student.picture.url}
        webhook.add_embed(embed)
        webhook.execute()
        return redirect(self.get_group().get_absolute_url())

    def form_invalid(self, form: AdminRequestForm):
        messages.error(self.request, _("An error occurred... 😥"))
        return redirect(self.get_group().get_absolute_url())


class AcceptAdminRequestView(UserIsGroupAdminMixin, View):
    def get(self, request: HttpRequest, id):
        member = get_object_or_404(Membership, id=id)
        if member.admin_request:
            member.accept_admin_request()
            messages.success(request, message=(_(
                "The user %(user)s is now admin!")
                % {'user': member.student}))
        else:
            messages.error(request, message=_("Request already answered!"))
        return redirect(member.group.get_absolute_url())


class DenyAdminRequestView(UserIsGroupAdminMixin, View):
    def get(self, request: HttpRequest, id):
        member = get_object_or_404(Membership, id=id)
        if member.admin_request:
            member.deny_admin_request()
            messages.success(request, message=(_(
                "The admin request from %(user)s has been denied.")
                % {'user': member.student}))
        else:
            messages.error(request, message=_("Request already answered!"))
        return redirect(member.group.get_absolute_url())
