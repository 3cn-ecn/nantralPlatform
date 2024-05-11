from django.apps import AppConfig


class AccountConfig(AppConfig):
    name = "apps.account"

    def ready(self) -> None:
        from . import signals  # noqa: F401

        return super().ready()
