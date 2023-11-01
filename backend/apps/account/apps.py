from django.apps import AppConfig


class AccountConfig(AppConfig):
    name = "apps.account"

    def ready(self) -> None:
        import apps.account.signals  # noqa: WPS433,F401

        return super().ready()
