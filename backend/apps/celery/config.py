import os

from celery import Celery
from celery.app import shared_task
from celery.schedules import crontab

from django.conf import settings


# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

app = Celery('core')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
print("autodiscover")
app.autodiscover_tasks(settings.COMMON_APPS)


@app.on_after_finalize.connect
def setup_periodic_tasks(sender: Celery, **kwargs):
    pass
    # set schedule for non shared tasks here.
    # sender.add_periodic_task(
    #     crontab(minute="*/1"),
    #     debug_task.s()
    # )


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
    print('Debug task is working.')
