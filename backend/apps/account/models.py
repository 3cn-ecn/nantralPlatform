import uuid
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from .manager import UserManager


class User(AbstractUser):
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    email = models.EmailField(unique=True)


class IdRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)


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
            super(TemporaryAccessRequest, self).save()
