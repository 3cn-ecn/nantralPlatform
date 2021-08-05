from django.contrib.auth.models import User
from django.contrib.auth.backends import ModelBackend


class EmailBackend(ModelBackend):
    def authenticate(username=None, password=None, **kwargs) -> User:
        try:
            user = User.objects.get(email=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None
