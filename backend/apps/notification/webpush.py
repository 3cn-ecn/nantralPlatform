from django.conf import settings
from django.db.models.query import QuerySet

from .tasks import send_webpush_notification_task


def send_webpush_notification(users: QuerySet, message: dict):
    """Send a notification on devices, to several users, with one message,
    by creating a celery task in background.

    Parameters
    ----------

    users : QuerySet<User>
        A queryset of user objects

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

    # we first convert the queryset of user to a list, because we cannot
    # pass a queryset for an async function with celery
    user_ids = list(users.all().values_list("id", flat=True))
    # check if celery is launched with a docker instance
    if hasattr(settings, "CELERY_BROKER_URL"):
        # launch the celery task for sending notifications in async
        # mode, so as to continue the process without waiting we have send all
        send_webpush_notification_task.delay(user_ids, message)
    else:
        # if the celery task does not work, send notifications in normal mode
        send_webpush_notification_task(user_ids, message)
