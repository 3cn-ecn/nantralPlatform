import json
import re
import datetime

from typing import List
from celery import shared_task
from django.utils import timezone
from push_notifications.models import WebPushDevice
from push_notifications.webpush import WebPushError


@shared_task
def send_webpush_notification_task(student_ids: List[int], message: dict):
    """The celery task for sending notifications to studends."""
    
    # get devices from students
    devices = WebPushDevice.objects.filter(
        user__student__id__in = student_ids
    )
    print("Devices: ", devices)
    # convert the message in json
    data = json.dumps(message)
    # send the message for each device
    for device in devices:
        try:
            device.send_message(message=data)
        except WebPushError as e:
            # retrive the server response
            print(e.args[0])
            result = re.search('Push failed: ([\d]+) ', e.args[0])
            error = int(result.group(1))
            # if device is no longer subscribed, delete it
            if error in [404, 410]:
                device.delete()


@shared_task
def clean_notifications():
    """A simple celery task to delete the old notifications"""

    # we decide to delete all notifications older than 60 days
    timeperiod = datetime.timedelta(day = 60)
    # then get the day of today
    today = timezone.now()
    # import the Notification model
    from .models import Notification
    # and finally delete the old notifications
    Notification.objects.filter(date__lt = today - timeperiod).delete()

