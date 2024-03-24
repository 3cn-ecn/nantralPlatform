from importlib import import_module

from django.apps import apps
from django.core.management.base import BaseCommand
from django.utils.module_loading import module_has_submodule

from apps.utils.fake_data_generator import FakeDataGenerator


class Command(BaseCommand):
    help = "Generates and saves fake data to the database"

    def add_arguments(self, parser):
        parser.add_argument(
            "apps",
            nargs="*",
            help="Apps to generate fake data for",
        )

    def handle(self, *args, **options):
        apps_selected = [
            f"apps.{app}" if not app.startswith("apps.") else app
            for app in options["apps"]
        ]

        for fake_data_class, app_name in self.get_classes(apps_selected):
            self.stdout.write(
                f"Run {fake_data_class.__name__} from app {app_name}...",
                self.style.MIGRATE_HEADING,
            )
            try:
                fake_data_class().run()
            except Exception as e:
                self.stdout.write(str(e), self.style.ERROR)

        self.stdout.write("Done", self.style.SUCCESS)

    def get_classes(self, apps_selected: list[str]):
        # Iterate over all installed apps
        for app_config in apps.get_app_configs():
            # If apps are selected, only consider those
            if apps_selected and app_config.name not in apps_selected:
                continue

            # Check if the app has a 'factories' module
            if module_has_submodule(app_config.module, "factories"):
                module = import_module(f"{app_config.name}.factories")

                # Iterate over all classes in the 'factories' module
                for name in dir(module):  # noqa: WPS421
                    obj = getattr(module, name)
                    if (
                        isinstance(obj, type)
                        and issubclass(obj, FakeDataGenerator)
                        and obj is not FakeDataGenerator
                    ):
                        yield obj, app_config.verbose_name
