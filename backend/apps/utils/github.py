from typing import Literal

from django.conf import settings

import requests
from rest_framework import status


def create_issue(title: str, body: str, label: Literal["bug", "suggestion"]):
    issue = {"title": title, "body": body, "labels": [label]}
    resp = requests.post(
        f"https://api.github.com/repos/{settings.GITHUB_REPO}/issues",
        json=issue,
        auth=(settings.GITHUB_USER, settings.GITHUB_TOKEN),
        timeout=10,
    )
    if resp.status_code != status.HTTP_201_CREATED:
        raise Exception(f"Error while posting issue to GitHub: {resp.reason}")
    return resp.json()["number"]


def close_issue(number: int):
    """Function to close an issue in the repo."""
    update = {"state": "closed"}
    requests.post(
        f"https://api.github.com/repos/{settings.GITHUB_REPO}/issues/{number}",
        json=update,
        auth=(settings.GITHUB_USER, settings.GITHUB_TOKEN),
        timeout=10,
    )
