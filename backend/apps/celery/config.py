import logging
import os

from django.conf import settings

from celery import Celery
from celery.schedules import crontab

logger = logging.getLogger(__name__)

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")

app = Celery("core")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
logger.info("autodiscover")
app.autodiscover_tasks(settings.COMMON_APPS)


@app.on_after_finalize.connect
def setup_periodic_tasks(sender: Celery, **kwargs):
    from apps.account.tasks import (
        delete_unverified_emails,
        send_email_verification_reminders,
    )

    # Schedule email verification reminders to run daily at 9 AM
    sender.add_periodic_task(
        crontab(hour=9, minute=0),
        send_email_verification_reminders.s(),
        name="send-email-verification-reminders",
    )

    # Schedule deletion of unverified emails to run daily at 10 AM
    sender.add_periodic_task(
        crontab(hour=10, minute=0),
        delete_unverified_emails.s(),
        name="delete-unverified-emails",
    )


@app.task(bind=True)
def debug_task(self):
    logger.info(f"Request: {self.request!r}")
    logger.info("Debug task is working.")
