from django.apps import AppConfig
from .tasks import remove_inactive_accounts, remove_temporary_access


class NotificationConfig(AppConfig):
    name = 'apps.account'
