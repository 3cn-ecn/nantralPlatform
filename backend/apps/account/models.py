import uuid

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions

from .manager import UserManager
from .utils import send_email_confirmation
from .validators import ecn_email_validator, matrix_username_validator


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

    objects = UserManager()

    username = models.CharField(
        _("Nom d'utilisateur"),
        max_length=150,
        unique=True,
        help_text=_(
            "Requis. 150 caractères ou moins. Lettres minuscules, chiffres et . _ - + seulement."
        ),
        validators=[matrix_username_validator],
        error_messages={
            "unique": _("Ce nom d'utilisateur est déjà pris"),
        },
    )
    email = models.EmailField(_("Email principal"), unique=True)
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
        self.email = self.email.lower()
        self.first_name = self.first_name.lower()
        self.last_name = self.last_name.lower()

        request = None
        if kwargs.get("request"):
            request = kwargs.pop("request")

        super().save(*args, **kwargs)

        if not self.has_email(self.email):
            self.add_email(self.email, request=request)

    def has_valid_ecn_email(self):
        return any(email.is_ecn_email for email in self.emails.filter(is_valid=True))

    def has_ecn_email(self):
        return any(email.is_ecn_email for email in self.emails.all())

    def has_valid_email(self):
        return self.emails.filter(is_valid=True).exists()

    def has_email(self, email):
        return self.emails.filter(email__iexact=email).exists()

    def add_email(self, email, request=None):
        email_object = self.emails.create(user=self, email=email)
        send_email_confirmation(email_object, request=request)
        return email_object

    def remove_email(self, email):
        if email == self.email:
            raise exceptions.ValidationError(_("Vous ne pouvez pas supprimer l'email principal"))
        return self.emails.filter(email__iexact=email).delete()

    @property
    def is_email_valid(self):
        return self.emails.filter(is_valid=True, email__iexact=self.email).exists()

    def get_email_obj(self):
        return self.emails.get(email__iexact=self.email)


class Email(models.Model):
    email = models.EmailField(unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="emails")
    is_valid = models.BooleanField(verbose_name=_("Email vérifié ?"), default=False)
    is_visible = models.BooleanField(verbose_name=_("Visibilité"), default=False, help_text=_("Cochez cette case pour rendre l'email visible à tous les utilisateurs"))
    # Utilisé pour la vérification
    uuid = models.UUIDField(_("Identifiant unique"), unique=True, default=uuid.uuid4)

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        super().save(*args, **kwargs)

    def delete(self, using = None, keep_parents = False):
        if self.user.email == self.email:
            raise exceptions.ValidationError(_("Vous ne pouvez pas supprimer l'email principal"))
        return super().delete(using=using, keep_parents=keep_parents)


    @property
    def is_ecn_email(self):
        try:
            ecn_email_validator(self.email)
            return True
        except ValidationError:
            return False
