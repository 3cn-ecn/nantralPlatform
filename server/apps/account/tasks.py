from datetime import datetime
from celery import shared_task
from django.contrib.auth.models import User
from apps.account.models import TemporaryAccessRequest
from django.conf import settings
from celery.utils.log import get_task_logger


logger = get_task_logger(__name__)


@shared_task
def remove_inactive_accounts():
    if settings.TEMPORARY_ACCOUNTS_DATE_LIMIT > datetime.now():
        for user in User.objects.filter(is_active=False):
            user: User
            try:
                authorization: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
                    user=user)
                if not authorization.mail_valid:
                    user.delete()
            except TemporaryAccessRequest.DoesNotExist:
                user.delete()
    else:
        User.objects.filter(is_active=False).delete()


@shared_task
def remove_temporary_access():
    TemporaryAccessRequest.objects.filter(
        approved_until__lt=datetime.now().date()).delete()
