import json
import re

from django.db.models.query import QuerySet

from push_notifications.models import WebPushDevice
from push_notifications.webpush import WebPushError


def send_webpush_notification(students: QuerySet, message: dict) -> None:
    """Send a notification on devices, to several students, with one message.
    
    Parameters
    ----------
    students : QuerySet<Student>
        A list of students
    message : dict
        A message to send, as a dict, with the following structure:
        {
            'title': <string>,
            'body': <string>,
            'icon': <string>,
            'image': <string>,
            'data': {
                'url': <string>,
                'action1_url': <string>,
                'action2_url': <string>
            }
        }
    """
    
    # get devices from studends
    devices = WebPushDevice.objects.filter(
        user__student__in = students
    )
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