from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.password_validation import validate_password


class ChangePassForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["old_password"].label = "Votre mot de passe actuel"
        self.fields["new_password1"].label = "Votre nouveau mot de passe"
        self.fields["new_password2"].label = "Confirmer le mot de passe"

    def clean_new_password2(self) -> str:
        password2 = super().clean_new_password2()
        validate_password(password2, self.user)
        return password2
