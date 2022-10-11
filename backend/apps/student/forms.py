from django import forms
from django.contrib.auth.forms import PasswordChangeForm


class ChangePassForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super(ChangePassForm, self).__init__(*args, **kwargs)
        self.fields['old_password'].label = "Votre mot de passe actuel"
        self.fields['new_password1'].label = "Votre nouveau mot de passe"
        self.fields['new_password2'].label = "Confirmer le mot de passe"
