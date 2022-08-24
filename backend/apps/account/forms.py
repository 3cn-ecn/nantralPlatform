import re

from django.utils import timezone
from django import forms
from django.conf import settings
from django.utils.translation import gettext as _
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError

from apps.student.models import FACULTIES, PATHS
from .models import IdRegistration


def check_id(id):
    if not IdRegistration.objects.filter(id=id).exists():
        raise ValidationError(_(
            "Invitation invalide : le lien d'invitation a expiré. Veuillez "
            "entrer une adresse en ec-nantes.fr, ou contactez un "
            "administrateur."))


def check_ecn_mail(mail: str):
    if re.search(r"@([\w\-\.]+\.)?ec-nantes.fr$", mail) is None:
        raise ValidationError(_(
            "Vous devez utiliser une adresse mail de Centrale Nantes finissant "
            "par ec-nantes.fr"))


def check_ecn_mail_login(mail: str):
    """A wrapper around the login check to disable during periods where all 
    emails can be used.
    """
    if settings.TEMPORARY_ACCOUNTS_DATE_LIMIT >= timezone.now().today():
        return
    check_ecn_mail(mail)


def check_passwords(pass1, pass2):
    if not pass1 == pass2:
        raise ValidationError(
            _('Les deux mots de passe ne correspondent pas.'))


class SignUpForm(UserCreationForm):
    email = forms.EmailField(
        max_length=200, validators=[check_ecn_mail],
        required=True, help_text=_('Votre adresse mail ec-nantes.fr'))
    confirm_email = forms.EmailField(
        max_length=200, required=True, help_text=_('Confirmez votre adresse.'))
    promo = forms.IntegerField(min_value=1919, required=True)
    first_name = forms.CharField(max_length=200, required=True)
    last_name = forms.CharField(max_length=200, required=True)
    faculty = forms.ChoiceField(required=True, choices=FACULTIES)
    path = forms.ChoiceField(
        choices=PATHS,
        help_text=_('Vous pourrez modifier cela plus tard'),
        required=False)

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.fields['email'].label = _("Adresse mail")
        self.fields['confirm_email'].label = _(
            "Confirmation de l'adresse mail")
        self.fields['first_name'].label = _("Prénom")
        self.fields['last_name'].label = _("NOM")
        self.fields['password1'].label = _("Mot de passe")
        self.fields['password2'].label = _("Confirmation du mot de passe")
        self.fields['password2'].help_text = _(
            "Entrez le même mot de passe pour vérification")
        self.fields['promo'].label = _("Année d'arrivée à Centrale")
        self.fields['faculty'].label = _("Filière")
        self.fields['path'].label = _('Cursus particulier ?')

    def clean(self):
        cleaned_data = super(SignUpForm, self).clean()
        email = cleaned_data.get("email")
        confirm_email = cleaned_data.get("confirm_email")
        try:
            User.objects.get(email=email)
            raise forms.ValidationError(_('Cet email est déjà utilisé.'))
        except User.DoesNotExist:
            if email and confirm_email:
                if email != confirm_email:
                    raise forms.ValidationError(
                        _("Les emails ne correspondent pas."))
            return cleaned_data

    def clean_email(self) -> str:
        data: str = self.cleaned_data['email']
        return data.lower()

    def clean_confirm_email(self) -> str:
        data: str = self.cleaned_data['confirm_email']
        return data.lower()

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'confirm_email',
                  'password1', 'password2', 'promo', 'faculty', )


class LoginForm(forms.Form):
    email = forms.EmailField(
        max_length=200,
        validators=[check_ecn_mail_login],
        required=True,
        help_text=_('Votre adresse mail ec-nantes.fr'))
    password = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields['password'].label = _("Mot de passe")
        self.fields['password'].help_text = (
            f"<a class='text-muted' href='/account/forgotten'>"
            f"{_('Mot de passe oublié  ?')}</a>"
        )

    def clean_email(self) -> str:
        data: str = self.cleaned_data['email']
        return data.lower()


class ForgottenPassForm(forms.Form):
    email = forms.EmailField(
        max_length=200,
        required=True,
        help_text=_('Entrez l\'adresse mail associée au compte'))

    def clean_email(self) -> str:
        data: str = self.cleaned_data['email']
        return data.lower()


class ResetPassForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        super(ResetPassForm, self).__init__(*args, **kwargs)
        self.fields['password'].label = _("Votre nouveau mot de passe")
        self.fields['password_confirm'].label = _("Confirmer le mot de passe")

    def clean(self):
        cleaned_data = super(ResetPassForm, self).clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm ')

        if password and password_confirm:
            if password != password_confirm:
                raise forms.ValidationError(
                    _("Les deux mots de passe ne correspondent pas."))
        return cleaned_data


class TemporaryRequestSignUpForm(SignUpForm):
    '''A form to request a temporary access to the platform.
    The user will have to confirm the school mail address later.
    '''
    email = forms.EmailField(
        max_length=200,
        required=True,
        help_text=_('Votre adresse mail personnelle.'))
    invite_id = forms.UUIDField(
        validators=[check_id],
        widget=forms.HiddenInput())


class UpgradePermanentAccountForm(forms.Form):
    """Form to get the school mail of the user for verification."""
    email = forms.EmailField(
        max_length=200,
        required=True,
        help_text=_('Votre adresse mail Centrale Nantes.'),
        validators=[check_ecn_mail]
    )
