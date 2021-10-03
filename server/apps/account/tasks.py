from datetime import date
from celery import shared_task
from django.contrib.auth.models import User
from apps.account.models import TemporaryAccessRequest
from django.conf import settings
from celery.utils.log import get_task_logger


logger = get_task_logger(__name__)


@shared_task
def remove_inactive_accounts():
    if settings.TEMPORARY_ACCOUNTS_DATE_LIMIT > date.today():
        for user in User.objects.filter(is_valid=False):
            user: User
            try:
                authorization: TemporaryAccessRequest = TemporaryAccessRequest.objects.get(
                    user=user)
                if not authorization.mail_valid:
                    user.delete()
            except TemporaryAccessRequest.DoesNotExist:
                user.delete()
    else:
        User.objects.filter(is_valid=False).delete()
