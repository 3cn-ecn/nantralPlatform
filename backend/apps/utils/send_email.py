from typing import Any, Optional

from django.core.mail import get_connection
from django.core.mail.message import EmailMultiAlternatives
from django.template.loader import render_to_string

DEFAULT_REPLY_TO_EMAIL = "contact@nantral-platform.fr"


def send_email(
    subject: str,
    to: str,
    template_name: str,
    context: Optional[dict[str, Any]] = None,
) -> int:
    """Send an email to a user.

    Parameters
    ----------
    subject : str
        The subject of the email.
    to : str
        The email address of the user.
    template_name : str
        The name of the template to use, in the templates/emails directory.
    context : dict[str, Any], optional
        The context object to pass to the template.

    Returns
    -------
    int
        Returns 0 if the email was sent successfully, 1 otherwise.
    """
    connection = get_connection()

    html_template = f"emails/{template_name}.html"
    text_template = f"emails/{template_name}.txt"

    html_body = render_to_string(html_template, context)
    text_body = render_to_string(text_template, context)

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        to=[to],
        connection=connection,
        alternatives=[(html_body, "text/html")],
        reply_to=[DEFAULT_REPLY_TO_EMAIL],
    )

    return message.send()


def send_mass_email(
    subject: str,
    recipient_list: list[str],
    template_name: str,
    context: Optional[dict[str, Any]] = None,
    context_list: Optional[list[dict[str, Any]]] = None,
) -> int:
    """Send an email to multiple users.

    Parameters
    ----------
    subject : str
        The subject of the email.
    recipient_list : list[str]
        The list of email addresses of the users.
    template_name : str
        The name of the template to use, in the templates/emails directory.
    context : dict[str, Any], optional
        The context object to pass to the template, if it is the same for all
        recipients.
    context_list : list[dict[str, Any]], optional
        The list of context objects to pass to the template, if it is different
        for each recipient.

    Returns
    -------
    int
        Returns 0 if the emails were sent successfully, 1 otherwise.
    """
    connection = get_connection()

    html_template = f"emails/{template_name}.html"
    text_template = f"emails/{template_name}.txt"

    if context_list is not None:
        # we compile the html and text messages for each recipient
        if len(recipient_list) != len(context_list):
            raise ValueError(
                "The number of recipients must match the number of contexts.",
            )
        html_bodies = [
            render_to_string(html_template, context) for context in context_list
        ]
        text_bodies = [
            render_to_string(text_template, context) for context in context_list
        ]
        messages = [
            EmailMultiAlternatives(
                subject=subject,
                body=text_body,
                to=[recipient],
                connection=connection,
                alternatives=[(html_body, "text/html")],
                reply_to=[DEFAULT_REPLY_TO_EMAIL],
            )
            for recipient, html_body, text_body in zip(
                recipient_list,
                html_bodies,
                text_bodies,
            )
        ]

    else:
        # we compile the html and text messages once for all recipients
        html_body = render_to_string(html_template, context)
        text_body = render_to_string(text_template, context)
        messages = [
            EmailMultiAlternatives(
                subject=subject,
                body=text_body,
                to=[recipient],
                connection=connection,
                alternatives=[(html_body, "text/html")],
                reply_to=[DEFAULT_REPLY_TO_EMAIL],
            )
            for recipient in recipient_list
        ]

    return connection.send_messages(messages)
