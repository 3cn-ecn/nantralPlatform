import uuid

from django.contrib.auth.models import AbstractUser
from django.core import validators
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .manager import UserManager


class MatrixUsernameValidator(validators.RegexValidator):
    regex = r"^[a-z0-9.=\-/+][a-z0-9._=\-/+]*\Z"
    message = _(
        "Enter a valid username. This value may contain only lower case letters, "
        "numbers, and ./_/=/-///+ characters. It may not start with _"
    )
    flags = 0

class InvitationLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    expires_at = models.DateTimeField()
    description = models.CharField(max_length=200)

    def __str__(self) -> str:
        if self.description:
            return self.description

        return f"""Invitation(Expires at:
         {self.expires_at.strftime("%d/%m/%Y, %H:%M:%S")})"""

    def get_absolute_url(self):
        return f"/register?uuid={self.id}/"

    def is_valid(self) -> bool:
        """Return True if invitation is not expired."""
        return self.expires_at > timezone.now()


class User(AbstractUser):
    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    username_validator = MatrixUsernameValidator()

    objects = UserManager()

    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Lower case letters, digits and ./_/=/-///+ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    email = models.EmailField(unique=True)
    is_email_valid = models.BooleanField(default=False)
    email_next = models.EmailField(blank=True)
    invitation = models.ForeignKey(
        InvitationLink,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    # While a user has not created his matrix account, it can alter its username
    # after it's too late since we won't be able to change the matrix username
    has_opened_matrix = models.BooleanField(default=False)
    has_updated_username = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        self.first_name = self.first_name.lower()
        self.last_name = self.last_name.lower()

        if self.email_next:
            self.email_next = self.email_next.lower()
        super().save(*args, **kwargs)
