from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.backends import ModelBackend
from django.conf import settings


class EmailBackend(ModelBackend):
    def authenticate(username=None, password=None, **kwargs) -> User:
        try:
            user = User.objects.get(email=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None

    def user_can_authenticate(self, user):
        """
        Reject users with is_active=False. Custom user models that don't have
        that attribute are allowed. Is disabled on certain time of the year.
        """
        if settings.TEMPORARY_ACCOUNTS_DATE_LIMIT >= timezone.now().today():
            return True
        is_active = getattr(user, 'is_active', None)
        return is_active or is_active is None
