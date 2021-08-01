from typing import Dict
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError

from apps.student.models import FACULTIES, PATHS


def check_ecn_mail(mail):
    if not 'ec-nantes.fr' in mail:
        raise ValidationError(
            'Vous devez avoir une adresse mail de Centrale Nantes finissant par ec-nantes.fr')


def check_passwords(pass1, pass2):
    if not pass1 == pass2:
        raise ValidationError('Les deux mots de passe ne correspondent pas.')


class SignUpForm(UserCreationForm):
    email = forms.EmailField(max_length=200, validators=[
                             check_ecn_mail], required=True, help_text='Votre adresse mail ec-nantes.fr')
    confirm_email = forms.EmailField(
        max_length=200, required=True, help_text='Confirmez votre adresse.')
    promo = forms.IntegerField(min_value=1919, required=True)
    first_name = forms.CharField(max_length=200, required=True)
    last_name = forms.CharField(max_length=200, required=True)
    faculty = forms.ChoiceField(required=True, choices=FACULTIES)
    path = forms.ChoiceField(
        choices=PATHS, help_text='Vous pourrez modifier cela plus tard', required=False)

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.fields['email'].label = "Adresse mail"
        self.fields['confirm_email'].label = "Confirmation de l'adresse mail"
        self.fields['first_name'].label = "Prénom"
        self.fields['last_name'].label = "NOM"
        self.fields['password1'].label = "Mot de passe"
        self.fields['password2'].label = "Confirmation du mot de passe"
        self.fields['password2'].help_text = "Entrez le même mot de passe pour vérification"
        self.fields['promo'].label = "Année de promotion entrante"
        self.fields['faculty'].label = "Filière"
        self.fields['path'].label = 'Cursus particulier ?'

    def clean(self):
        cleaned_data = super(SignUpForm, self).clean()
        email = cleaned_data.get("email")
        confirm_email = cleaned_data.get("confirm_email")
        try:
            User.objects.get(email=email)
            raise forms.ValidationError('Cet email est déjà utilisé.')
        except User.DoesNotExist:
            if email and confirm_email:
                if email != confirm_email:
                    raise forms.ValidationError(
                        "Les emails ne correspondent pas.")

            return cleaned_data

    def clean_email(self) -> str:
        data: str = self.cleaned_data['email']
        return data.lower()

    def clean_confirm_email(self) -> str:
        data: str = self.cleaned_data['confirm_email']
        return data.lower()

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email',
                  'password1', 'password2', 'promo', 'faculty')


class LoginForm(forms.Form):
    email = forms.EmailField(max_length=200, validators=[
                             check_ecn_mail], required=True, help_text='Votre adresse mail ec-nantes.fr')
    password = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields['password'].label = "Mot de passe"
        self.fields['password'].help_text = "<a class='text-muted' href='/account/forgotten'>Mot de passe oublié  ?</a>"

    def clean_email(self) -> str:
        data: str = self.cleaned_data['email']
        return data.lower()


class ForgottenPassForm(forms.Form):
    email = forms.EmailField(max_length=200, required=True,
                             help_text='Entrez l\'adresse mail associée au compte')

    def clean_email(self) -> str:
        data: str = self.cleaned_data['email']
        return data.lower()


class ResetPassForm(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput)
    password_confirm = forms.CharField(widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        super(ResetPassForm, self).__init__(*args, **kwargs)
        self.fields['password'].label = "Votre nouveau mot de passe"
        self.fields['password_confirm'].label = "Confirmer le mot de passe"

    def clean(self):
        cleaned_data = super(ResetPassForm, self).clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm ')

        if password and password_confirm:
            if password != password_confirm:
                raise forms.ValidationError(
                    "Les deux mots de passe ne correspondent pas.")
        return cleaned_data


class TemporaryRequestSignUpForm(SignUpForm):
    '''A form to request a temporary access to the platform.
    The user will have to confirm the school mail address later.
    '''
    email = forms.EmailField(
        max_length=200, required=True, help_text='Votre adresse mail personnelle.')
