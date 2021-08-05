from django.template.loader import render_to_string
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.urls import reverse
from apps.utils.discord import send_message, react_message


class TemporaryAccessRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    approved_until = models.DateField()
    date = models.DateField()
    message_id = models.IntegerField(blank=True, null=True)
    domain = models.CharField(max_length=64)

    def save(self, domain: str, *args, **kwargs):
        self.date = timezone.now()
        self.approved_until = timezone.now()
        self.domain = domain
        super(TemporaryAccessRequest, self).save()
        message = f'{self.user.first_name} {self.user.last_name} demande à rejoindre Nantral Platform.\n'
        embeds = [
            {"title": "Accepter",
             "url": self.approve_url},
            {"title": "Refuser",
             "url": self.deny_url}
        ]
        self.message_id = send_message(
            872205601298604052, message, embeds)
        super(TemporaryAccessRequest, self).save()

    @property
    def approve_url(self):
        return f"http://{self.domain}{reverse('account:temp-req-approve', kwargs={'id': self.id})}"

    @property
    def deny_url(self):
        return f"http://{self.domain}{reverse('account:temp-req-deny', kwargs={'id': self.id})}"

    def approve(self):
        self.approved_until = settings.TEMPORARY_ACCOUNTS_DATE_LIMIT
        react_message(872205601298604052, self.message_id, '%F0%9F%91%8C')
        user: User = self.user
        subject = '[Nantral Platform] Votre accès temporaire a été approuvé.'
        message = render_to_string('account/mail/temp_req_approved.html', {
            'user': user,
            'domain': self.domain
        })
        user.email_user(
            subject=subject, from_email='accounts@nantral-platform.fr', html_message=message)
        self.save(self.domain)

    def deny(self):
        user: User = self.user
        subject = '[Nantral Platform] Votre accès temporaire a été refusée.'
        message = render_to_string('account/mail/temp_req_denied.html', {
            'user': user,
            'domain': self.domain
        })
        user.email_user(
            subject=subject, from_email='accounts@nantral-platform.fr', html_message=message)
        self.user.delete()
        self.delete()
