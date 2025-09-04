import uuid

from django.contrib import admin
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions

from .manager import UserManager
from .utils import send_email_confirmation
from .validators import (
    ecn_email_validator,
    validate_matrix_username,
)


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
    EMAIL_FIELD = "email__email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    username = models.CharField(
        _("Username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Lower case letters, digits and ./_/-/+ only."
        ),
        validators=[validate_matrix_username],
        error_messages={
            "unique": _("This username is already taken."),
        },
    )
    email = models.OneToOneField("Email", verbose_name=_("Main email"), on_delete=models.RESTRICT, related_name="primary_from")
    invitation = models.ForeignKey(
        InvitationLink,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    # While a user has not created his matrix account, they can alter their username
    # after it is too late since we won't be able to change the matrix username
    has_opened_matrix = models.BooleanField(default=False)
    has_updated_username = models.BooleanField(default=False)



    def save(self, *args, **kwargs):
        self.first_name = self.first_name.lower()
        self.last_name = self.last_name.lower()

        super().save(*args, **kwargs)

    @admin.display(boolean=True)
    def has_valid_ecn_email(self):
        return any(email.is_ecn_email() for email in self.emails.filter(is_valid=True))

    @admin.display(boolean=True)
    def has_ecn_email(self):
        return any(email.is_ecn_email() for email in self.emails.all())

    @admin.display(boolean=True)
    def has_valid_email(self):
        return self.emails.filter(is_valid=True).exists()

    @admin.display(boolean=True)
    def has_email(self, email):
        return self.emails.filter(email__iexact=email).exists()

    def add_email(self, email, request=None):
        email_object = self.emails.create(user=self, email=email)
        send_email_confirmation(email_object, request=request)
        return email_object

    def remove_email(self, email):
        if email == self.email.email:
            raise exceptions.ValidationError(_("You cannot delete the main email address of your account"))
        return self.emails.filter(email__iexact=email).delete()

    @admin.display(boolean=True)
    def is_email_valid(self):
        return self.emails.filter(is_valid=True, email__iexact=self.email.email).exists()

    @property
    def email__email(self):
        """Get email as string, this allows to use `email__email` as `EMAIL_FIELD`."""
        return self.email.email

    class Meta:
        ordering = ["last_name", "first_name", "username"]

    def __str__(self):
        return f"{self.student.alphabetical_name if hasattr(self, "student") else str(self.email)} ({self.username})"


class Email(models.Model):
    email = models.EmailField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="emails")
    is_valid = models.BooleanField(verbose_name=_("Verified email?"), default=False)
    is_visible = models.BooleanField(
        verbose_name=_("Visibility"),
        default=False,
        help_text=_("Check this to make this email visible for all users"),
    )
    # Utilisé pour la vérification
    uuid = models.UUIDField(_("Unique ID"), unique=True, default=uuid.uuid4)

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        if self.user.email == self.email:
            raise exceptions.ValidationError(_("You cannot delete the main email address of your account"))
        return super().delete(using=using, keep_parents=keep_parents)

    @admin.display(boolean=True)
    def is_ecn_email(self):
        try:
            ecn_email_validator(self.email)
            return True
        except exceptions.ValidationError:
            return False
