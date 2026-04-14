from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailConfirmationTokenGenerator(PasswordResetTokenGenerator):
    """Generate tokens based on email id

    The base class is meant to use the User model, but we override the only method that uses it,
    so we can safely use the Email model.
    """

    def _make_hash_value(self, email, timestamp):
        return str(email.pk) + str(timestamp)


email_confirmation_token = EmailConfirmationTokenGenerator()
