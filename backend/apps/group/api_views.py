from django.conf import settings
from django.contrib import messages
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import redirect, get_object_or_404
from django.urls.base import reverse
from django.utils import timezone
from django.utils.dateparse import parse_date
from django.views.generic import FormView, View


from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from discord_webhook import DiscordWebhook, DiscordEmbed

from apps.student.models import Student

from .views import UserCanSeeGroupMixin
from .models import Group, Membership
from .forms import MembershipForm, AdminRequestForm
from .serializers import MembershipSerializer


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
            messages.success(self.request, 'Membre supprimé.')
        else:
            # create or update the membership
            created = form.instance.pk is None
            form.save()
            if created:
                self.group.subscribers.add(student)
                messages.success(self.request, 'Bienvenue dans le groupe !')
            else:
                messages.success(
                    self.request,
                    'Les modifications ont bien été enregistrées !')
        # return to the page
        return redirect(self.group.get_absolute_url())

    def form_invalid(self, form: MembershipForm):
        messages.error(self.request, 'Modification refusée... 😥')
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
        messages.success(
            self.request,
            ("Votre demande a bien été envoyée ! Vous recevrez la "
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


class UpdateMembershipsAPIView(APIView):
    """API endpoint to interact with the members of a club."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        group_slug = request.query_params.get('slug')
        group = get_object_or_404(Group, slug=group_slug)
        end_date = timezone.now()
        memberships = group.membership_set.filter(
            Q(end_date__isnull=True) | Q(end_date__gt=end_date)
        ).order_by('student__user__first_name')
        serializer = MembershipSerializer(memberships, many=True)
        return Response(data=serializer.data)

    def post(self, request, *args, **kwargs):
        # Check if group's admin
        user = self.request.user
        group = get_object_or_404(Group, slug=request.query_params.get('slug'))
        if not group.is_admin(user):
            return HttpResponse(status=403)

        edit_mode = request.data.get("editMode")
        # edit_mode == 1 -> Edit the order of the members
        # edit_mode == 2 -> Edit a member
        # edit_mode == 3 -> Delete a member
        # edit_mode == 4 -> Add a member
        if edit_mode == 1:
            new_ordered_members = request.data.get("orderedMembers")
            for member in new_ordered_members:
                (Membership.objects
                 .filter(id=member.get("id"))
                 .update(order=member.get("order")))
            return HttpResponse(status=200)

        elif edit_mode == 2:
            id = request.data.get("id")
            summary = request.data.get("summary")
            begin_date = parse_date(request.data.get("beginDate"))
            end_date = parse_date(request.data.get("endDate"))
            admin = request.data.get("admin")
            Membership.objects.get(id).update(
                summary=summary,
                admin=admin,
                begin_date=begin_date,
                end_date=end_date)
            return HttpResponse(status=200)

        elif edit_mode == 3:
            id = request.data.get("id")
            Membership.objects.get(id).delete()
            return HttpResponse(status=200)

        elif edit_mode == 4:
            student = Student.objects.get(id=request.data.get("id"))
            # Check if student already exists
            membership = Membership(
                student=student,
                group=group,
                admin=request.data.get("admin"),
                function=request.data.get("function"),
                begin_date=parse_date(request.data.get("beginDate")),
                end_date=parse_date(request.data.get("endDate"))
            )
            membership.full_clean()
            membership.save()
            return HttpResponse(status=200)
