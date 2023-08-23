from unittest import mock


def discord_mock_message_post() -> mock.Mock:
    """Mock response for the discord API response to posting a message."""
    mock_response = mock.Mock()
    expected_dict = {"id": 1}
    # Define response data for my Mock object
    mock_response.json.return_value = expected_dict
    mock_response.status_code = 200
    return mock_response
