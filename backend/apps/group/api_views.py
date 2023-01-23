from django.conf import settings
from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls.base import reverse
from django.views.generic import FormView, View

from discord_webhook import DiscordWebhook, DiscordEmbed

from .views import UserCanSeeGroupMixin
from .models import Group
from .forms import MembershipForm, AdminRequestForm


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
