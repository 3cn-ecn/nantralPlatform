import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from .manager import UserManager


class IdRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    expires_at = models.DateTimeField()

    def __str__(self) -> str:
        return f"""Invitation(Expires at:
         {self.expires_at.strftime('%d/%m/%Y, %H:%M:%S')})"""

    def is_valid(self) -> bool:
        """Return True if invitation is not expired."""
        return self.expires_at > timezone.now().today()


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
