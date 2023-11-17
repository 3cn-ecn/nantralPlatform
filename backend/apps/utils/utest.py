from django.contrib.auth import get_user_model

User = get_user_model()


class TestMixin(object):
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

    PASSWORD = "secured_password"

    def user_setup(self) -> None:
        """Create 3 standards users: u1, u2 and u3. Only u2 and u3
        are linked to a Student instance.
        """
        self.u1 = User.objects.create_superuser(
            username="admin", email="admin@ec-nantes.fr", password=self.PASSWORD
        )
        self.u2 = self.create_user("user2", "user@ec-nantes.fr")
        self.u3 = self.create_user("user3", "user3@ec-nantes.fr")

    def create_user(
        self, username: str, email: str, is_active: bool = True, name: str = ""
    ) -> User:
        """Create a new user and a Student object with it.

        Parameters
        ----------
        username : str
            The username
        email : str
            The email of the user
        is_active : bool, optional
            Indicate if the user is active or not, by default True
        name : str, optional
            The name of the user, by default empty

        Returns
        -------
        User
            The user instance created
        """
        u = User.objects.create(username=username, email=email)
        u.set_password(self.PASSWORD)
        u.is_active = is_active
        u.name = name
        u.save()
        return u

    def user_teardown(self) -> None:
        """Delete the users of the database."""
        User.objects.all().delete()
