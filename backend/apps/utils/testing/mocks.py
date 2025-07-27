from unittest import mock

from numpy import number

from apps.account.models import User
from apps.student.models import Student


def discord_mock_message_post() -> mock.Mock:
    """Mock response for the discord API response to posting a message."""
    mock_response = mock.Mock()
    expected_dict = {"id": 1}
    # Define response data for my Mock object
    mock_response.json.return_value = expected_dict
    mock_response.status_code = 200
    return mock_response


# ruff: noqa: PLR0913
def create_student_user(
    # ruff: noqa: S107
    password: str = "SecuredAndSafePassword",
    email: str = "test@ec-nantes.fr",
    username: str = "",
    faculty: str = "Gen",
    first_name: str | None = "Jean",
    last_name: str | None = "Delacourt",
    path: str | None = None,
    promo: number | None = None,
    is_superuser: bool = False,
    is_email_valid: bool = True,
    **kwargs,
) -> User:
    """_summary_
    Create a mock student user. For test purposes only
    """
    user_kwargs = {
        "password": password,
        "username": username,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        **kwargs,
    }
    if is_superuser:
        user = User.objects.create_superuser(**user_kwargs)
    else:
        user = User.objects.create_user(**user_kwargs)

    email_obj = user.get_email_obj()
    email_obj.is_valid = is_email_valid
    email_obj.save()
    Student.objects.create(user=user, faculty=faculty, path=path, promo=promo)
    return user
