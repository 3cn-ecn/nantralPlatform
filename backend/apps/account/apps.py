from django.apps import AppConfig


class AccountConfig(AppConfig):
    name = "apps.account"

    def ready(self) -> None:
        import apps.account.signals

        return super().ready()
