import json
import re
from typing import List
from celery import shared_task
from django.db.models.query import QuerySet
from push_notifications.models import WebPushDevice
from push_notifications.webpush import WebPushError


def send_webpush_notification(students: QuerySet, message: dict) -> None:
    """Send a notification on devices, to several students, with one message.
    Call with send_webpush_notification.delay(students, message)
    
    Parameters
    ----------

    students : QuerySet<Student>
        A queryset of student objects
    
    message : dict
        A message to send, as a dict, with the structure of the "options"
        parameter of a notification:
        https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
        Please note that title must be placed in the same dict as options in our
        case, for simplicity.
        You can also use the key "hidden": if true, you can send a notification
        to a user but it won't be shown to him (useful for incrementing the
        badge for example).
    
    Returns
    -------
    None
    """

    # we first convert the queryset of student to a list, because we cannot
    # pass a queryset for an async function with celery
    student_ids = list(students.values_list('id', flat=True))
    # then we execute the async function, so as to not wait the result
    _send_webpush_notification_async.delay(student_ids, message)


@shared_task
def _send_webpush_notification_async(students_ids: List[int], message: dict):
    
    # get devices from studends
    devices = WebPushDevice.objects.filter(
        user__student__id__in = students_ids
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