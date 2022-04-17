import kombu
from django.db.models.query import QuerySet

from .tasks import send_webpush_notification_task


def send_webpush_notification(students: QuerySet, message: dict) -> bool:
    """Send a notification on devices, to several students, with one message,
    by creating a celery task in background.
    
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
    task_launched : bool
        Return True if the celery task has been created successfully,
        else False
    """

    # we first convert the queryset of student to a list, because we cannot
    # pass a queryset for an async function with celery
    student_ids = list(students.values_list('id', flat=True))
    # then we try to launch the celery task for sending notifications in async
    # mode, so as to continue the process without waiting we have send all
    try:
        send_webpush_notification_task.delay(student_ids, message)
    except kombu.exceptions.OperationalError as err:
        # if the celery task does not work, send notifications in sync mode
        print("WARNING: cannot send notifications through celery")
        print("Celery might not be configured on this machine.")
        print("Error code:", err)
        send_webpush_notification_task(student_ids, message)

