import traceback
from importlib import import_module

from django.apps import apps
from django.core.management.base import BaseCommand
from django.utils.module_loading import module_has_submodule

from apps.utils.factories.fake_data_generator import FakeDataGenerator


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
            app if app.startswith("apps.") else f"apps.{app}"
            for app in options["apps"]
        ]
        verbosity = options["verbosity"]

        generator_classes = self.get_classes(apps_selected)
        sorted_generators = self.resolve_dependencies(generator_classes)

        for fake_data_class in sorted_generators:
            self.stdout.write(
                f"Running {fake_data_class.__name__}...",
                self.style.MIGRATE_HEADING,
            )
            try:
                fake_data_class().run()
            except Exception as e:
                error_class = e.__class__.__name__
                error_module = e.__class__.__module__
                self.stdout.write(
                    f"Error {error_class} ({error_module}): {e}",
                    self.style.ERROR,
                )
                if verbosity >= 2:
                    traceback.print_exc()
                if isinstance(e, KeyError) and str(e) == "'locale'":
                    self.stdout.write(
                        "This seems to be a bug from the faker library. "
                        "Do not use factory.Faker in the decider of a Maybe.",
                        self.style.NOTICE,
                    )

        self.stdout.write("Done", self.style.SUCCESS)

    def get_classes(self, apps_selected: list[str]):
        classes = []
        # Iterate over all installed apps
        for app_config in apps.get_app_configs():
            # If apps are selected, only consider those
            if apps_selected and app_config.name not in apps_selected:
                continue

            # Check if the app has a 'factories' module
            if module_has_submodule(app_config.module, "factories"):
                module = import_module(f"{app_config.name}.factories")

                # Iterate over all classes in the 'factories' module
                for name in dir(module):
                    obj = getattr(module, name)
                    if (
                        isinstance(obj, type)
                        and issubclass(obj, FakeDataGenerator)
                        and obj is not FakeDataGenerator
                    ):
                        classes.append(obj)
        return classes

    def resolve_dependencies(self, generators):
        sorted_generators = []
        resolved = set()

        def resolve(generator):
            if generator in resolved:
                return
            for dependency_name in generator.dependencies:
                dependency = next(
                    (g for g in generators if g.__name__ == dependency_name),
                    None,
                )
                if dependency and dependency not in resolved:
                    resolve(dependency)
            resolved.add(generator)
            sorted_generators.append(generator)

        for generator in generators:
            resolve(generator)

        return sorted_generators
