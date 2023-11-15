import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils import timezone

from .manager import UserManager


class InvitationLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    expires_at = models.DateTimeField()
    description = models.CharField(max_length=200)

    def __str__(self) -> str:
        if self.description:
            return self.description

        return f"""Invitation(Expires at:
         {self.expires_at.strftime('%d/%m/%Y, %H:%M:%S')})"""

    def is_valid(self) -> bool:
        """Return True if invitation is not expired."""
        return self.expires_at > timezone.now()

    def get_absolute_url(self):
        return reverse("account:temp-registration-choice", args=[self.id])


class User(AbstractUser):
    USERNAME_FIELD = "email"  # noqa: WPS 115
    EMAIL_FIELD = "email"  # noqa: WPS 115
    REQUIRED_FIELDS = ["username"]  # noqa: WPS 115

    objects = UserManager()

    email = models.EmailField(unique=True)
    is_email_valid = models.BooleanField(default=False)
    email_next = models.EmailField(blank=True)
    invitation = models.ForeignKey(
        InvitationLink, null=True, blank=True, on_delete=models.SET_NULL
    )

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        self.first_name = self.first_name.lower()
        self.last_name = self.last_name.lower()

        if self.email_next:
            self.email_next = self.email_next.lower()
        super().save(*args, **kwargs)
