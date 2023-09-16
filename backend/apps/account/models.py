import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from .manager import UserManager


class IdRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    expires_at = models.DateTimeField()


class User(AbstractUser):
    USERNAME_FIELD = "email"  # noqa: WPS 115
    EMAIL_FIELD = "email"  # noqa: WPS 115
    REQUIRED_FIELDS = ["username"]  # noqa: WPS 115

    objects = UserManager()

    email = models.EmailField(unique=True)
    is_email_valid = models.BooleanField(default=False)
    email_next = models.EmailField(null=True, blank=True)
    invitation = models.ForeignKey(
        IdRegistration, null=True, blank=True, on_delete=models.SET_NULL
    )

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        super().save(*args, **kwargs)


class TemporaryAccessRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    approved_until = models.DateField()
    date = models.DateField()
    message_id = models.CharField(max_length=50, blank=True, null=True)
    domain = models.CharField(max_length=64)
    approved = models.BooleanField()
    mail_valid = models.BooleanField()
    final_email = models.EmailField(blank=True, null=True)

    def save(self, domain: str | None = None, *args, **kwargs):
        if settings.TEMPORARY_ACCOUNTS_DATE_LIMIT > timezone.now().today():
            if self.mail_valid is None:
                self.mail_valid = False
            if self.approved is None:
                self.approved = True
            self.date = timezone.now()
            if self.approved_until is None:
                self.approved_until = timezone.now()
            if domain is not None:
                self.domain = domain
            self.approved_until = settings.TEMPORARY_ACCOUNTS_DATE_LIMIT
            super().save()
