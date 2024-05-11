import re

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.utils.translation import gettext_lazy

from apps.student.models import FACULTIES, PATHS

from .models import InvitationLink

User = get_user_model()


def check_id(id_to_check: str):
    if not InvitationLink.objects.filter(id=id_to_check).exists():
        raise ValidationError(
            _(
                "Invitation invalide : le lien d'invitation a expiré. Veuillez "
                "entrer une adresse en ec-nantes.fr, ou contactez un "
                "administrateur.",
            ),
        )


def check_ecn_mail(mail: str):
    if re.search(r"@([\w\-\.]+\.)?ec-nantes.fr$", mail) is None:
        raise ValidationError(
            _(
                "Vous devez utiliser une adresse mail de Centrale Nantes "
                "finissant par ec-nantes.fr",
            ),
        )


def check_passwords(pass1, pass2):
    if not pass1 == pass2:
        raise ValidationError(_("Les deux mots de passe ne correspondent pas."))


class SignUpForm(UserCreationForm):
    email = forms.EmailField(
        label=gettext_lazy("Adresse mail"),
        max_length=200,
        validators=[check_ecn_mail],
        required=True,
        help_text=gettext_lazy("Votre adresse mail ec-nantes.fr"),
    )
    confirm_email = forms.EmailField(
        label=gettext_lazy("Confirmation de l'adresse mail"),
        max_length=200,
        required=True,
        help_text=gettext_lazy("Confirmez votre adresse."),
    )
    promo = forms.IntegerField(
        label=gettext_lazy("Année d'arrivée à Centrale"),
        min_value=1919,
        required=True,
    )
    first_name = forms.CharField(
        label=gettext_lazy("Prénom"),
        max_length=200,
        required=True,
    )
    last_name = forms.CharField(
        label=gettext_lazy("Nom"),
        max_length=200,
        required=True,
    )
    faculty = forms.ChoiceField(
        label=gettext_lazy("Filière"),
        required=True,
        choices=FACULTIES,
    )
    path = forms.ChoiceField(
        label=gettext_lazy("Cursus particulier ?"),
        choices=PATHS,
        help_text=gettext_lazy("Vous pourrez modifier cela plus tard"),
        required=False,
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password1"].label = _("Mot de passe")
        self.fields["password2"].label = _("Confirmation du mot de passe")
        self.fields["password2"].help_text = _(
            "Entrez le même mot de passe pour vérification",
        )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        confirm_email = cleaned_data.get("confirm_email")
        try:
            User.objects.get(email=email)
            raise forms.ValidationError(_("Cet email est déjà utilisé."))
        except User.DoesNotExist:
            if email and confirm_email and email != confirm_email:
                raise forms.ValidationError(
                    _("Les emails ne correspondent pas."),
                )
            return cleaned_data

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "confirm_email",
            "password1",
            "password2",
            "promo",
            "faculty",
        )


class LoginForm(forms.Form):
    email = forms.EmailField(
        max_length=200,
        required=True,
        help_text=gettext_lazy("Votre adresse mail ec-nantes.fr"),
    )
    password = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password"].label = _("Mot de passe")
        self.fields["password"].help_text = (
            f"<a class='text-muted' href='/account/forgotten'>"
            f"{_('Mot de passe oublié  ?')}</a>"
        )

    def clean_email(self) -> str:
        data: str = self.cleaned_data["email"]
        return data.lower()


class ForgottenPassForm(forms.Form):
    email = forms.EmailField(
        max_length=200,
        required=True,
        help_text=_("Entrez l'adresse mail associée au compte"),
    )

    def clean_email(self) -> str:
        data: str = self.cleaned_data["email"]
        return data.lower()


class ResetPassForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password"].label = _("Votre nouveau mot de passe")
        self.fields["password_confirm"].label = _("Confirmer le mot de passe")

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_confirm = cleaned_data.get("password_confirm ")

        if password and password_confirm:
            if password != password_confirm:
                raise forms.ValidationError(
                    _("Les deux mots de passe ne correspondent pas."),
                )
        return cleaned_data


class TemporaryRequestSignUpForm(SignUpForm):
    """A form to request a temporary access to the platform.

    The user will have to confirm the school mail address later.
    """

    email = forms.EmailField(
        max_length=200,
        required=True,
        help_text=gettext_lazy("Votre adresse mail personnelle."),
    )
    invite_id = forms.UUIDField(
        validators=[check_id],
        widget=forms.HiddenInput(),
    )


class UpgradePermanentAccountForm(forms.Form):
    """Form to get the school mail of the user for verification."""

    email = forms.EmailField(
        max_length=200,
        required=True,
        help_text=gettext_lazy("Votre adresse mail Centrale Nantes."),
        validators=[check_ecn_mail],
    )
