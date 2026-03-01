from django.core.management import call_command

from celery import shared_task


@shared_task
def clean_duplicate_history_task(
    minutes=None, auto_or_models: list | bool = True, excluded_fields=None
):
    command = ["clean_duplicate_history"]
    if auto_or_models is True:
        command.append("--auto")
    else:
        command.extend(auto_or_models)
    if minutes is not None:
        command.extend(["-m", str(minutes)])
    if excluded_fields:
        command.append("excluded_fields")
        command.extend(excluded_fields)
    call_command(*command)


@shared_task
def clean_old_history_task(days=None, auto_or_models: list | bool = True):
    command = ["clean_old_history"]
    if auto_or_models is True:
        command.append("--auto")
    else:
        command.extend(auto_or_models)
    if days is not None:
        command.extend(["--days", str(days)])
    call_command(*command)
