from django.utils import timezone

from celery import shared_task

from .models import Email
from .utils import send_email_confirmation


@shared_task
def send_email_verification_reminders():
    """Send daily reminders for unverified emails within the 3-day grace period.

    This task:
    - Finds unverified emails created 1-2 days ago
    - Sends a reminder email if not already sent today
    - Updates the last_reminder_sent timestamp
    """
    from datetime import timedelta

    now = timezone.now()
    one_day_ago = now - timedelta(days=1)
    three_days_ago = now - timedelta(days=3)

    # Find unverified emails within the 3-day grace period
    # Exclude emails that had a reminder sent today
    unverified_emails = Email.objects.filter(
        is_valid=False,
        created_at__gte=three_days_ago,
        created_at__lte=one_day_ago,
    ).exclude(
        last_reminder_sent__gte=now.replace(
            hour=0, minute=0, second=0, microsecond=0
        )
    )

    sent_count = 0
    for email_obj in unverified_emails:
        try:
            send_email_confirmation(email_obj)

            # Update the last_reminder_sent timestamp
            email_obj.last_reminder_sent = now
            email_obj.save(update_fields=["last_reminder_sent"])
            sent_count += 1
        except Exception as e:
            # Log the error but continue with other emails
            import logging

            logger = logging.getLogger(__name__)
            logger.error(
                f"Failed to send reminder for email {email_obj.email}: {e!s}"
            )
            continue

    return f"Sent {sent_count} email verification reminders"


@shared_task
def delete_unverified_emails():
    """Delete emails that are still unverified after 3 days.

    This task:
    - Finds unverified emails older than 3 days
    - Deletes them and removes the user if no other verified email exists
    """
    from datetime import timedelta

    now = timezone.now()
    three_days_ago = now - timedelta(days=3)

    # Find unverified emails older than 3 days
    unverified_old_emails = Email.objects.filter(
        is_valid=False,
        created_at__lt=three_days_ago,
    )

    deleted_count = 0
    for email_obj in unverified_old_emails:
        user = email_obj.user

        # Check if this is the user's primary email
        is_primary = user.email == email_obj

        # Delete the email
        email_obj.delete()
        deleted_count += 1

        # If it was the primary email and the user has no other verified emails,
        # optionally handle this case (e.g., notify admin or delete user)
        if is_primary and not user.emails.filter(is_valid=True).exists():
            # You can add additional logic here, e.g., send admin notification
            import logging

            logger = logging.getLogger(__name__)
            logger.warning(
                f"User {user.id} ({user.username}) has no verified emails left "
                f"after deletion of primary unverified email {email_obj.email}"
            )

    return f"Deleted {deleted_count} unverified emails"
