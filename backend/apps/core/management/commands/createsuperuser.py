from django.contrib.auth.management.commands import createsuperuser
from django.utils.text import capfirst


class Command(createsuperuser.Command):
    def handle(self, *args, **options):
        super().handle(*args, **options)

    def _validate_username(self, username, verbose_field_name, database):
        """Validate username. If invalid, return a string error message."""

        if self.username_is_unique:
            try:
                self.UserModel._default_manager.db_manager(
                    database
                ).get_by_natural_key(username)
            except self.UserModel.DoesNotExist:
                pass
            else:
                return f"Error: That {verbose_field_name} is already taken."
        if not username:
            return f"{capfirst(verbose_field_name)} cannot be blank."
