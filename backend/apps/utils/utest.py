from apps.account.models import User
from apps.utils.testing.mocks import create_student_user


class TestMixin:
    """Abstract class to provide user account for tests

    Methods
    -------
    user_setup() -> None
        Create 3 users
    create_user(username: str, email: string, is_active: bool, name: str)->User
        Create a new user
    user_teardown() -> None
        Delete the users of the database
    """

    password = "secured_password"  # noqa: S105

    def user_setup(self) -> None:
        """Create 3 standards users: u1, u2 and u3."""
        self.u1 = create_student_user(
            username="admin",
            email="admin@ec-nantes.fr",
            password=self.password,
            is_superuser=True,
        )
        self.u2 = create_student_user(
            username="user2", email="user@ec-nantes.fr", password=self.password
        )
        self.u3 = create_student_user(
            username="user3", email="user3@ec-nantes.fr", password=self.password
        )

    def user_teardown(self) -> None:
        """Delete the users of the database."""
        User.objects.all().delete()
