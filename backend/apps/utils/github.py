import requests
from django.conf import settings


def create_issue(title: str, body: str, label):
    label = "bug" if int(label) == 1 else "suggestion"
    issue = {
        'title': title,
        'body': body,
        'labels': [label]
    }
    resp = requests.post(
        f'https://api.github.com/repos/{settings.GITHUB_REPO}/issues',
        json=issue,
        auth=(
            settings.GITHUB_USER,
            settings.GITHUB_TOKEN))
    if resp.status_code != 201:
        raise Exception(
            f'Error while posting issue to Github: {resp.reason}')
    return resp.json()['number']


def close_issue(number: int):
    """Function to close an issue in the repo."""
    update = {'state': 'closed'}
    requests.post(
        f'https://api.github.com/repos/{settings.GITHUB_REPO}/issues/{number}',
        json=update,
        auth=(
            settings.GITHUB_USER,
            settings.GITHUB_TOKEN))
