from datetime import datetime, timedelta, timezone

import requests

from config.settings.base import HELLOASSO_CLIENT_ID, HELLOASSO_CLIENT_SECRET

from .models import AccessToken, RefreshToken

HELLOASSO_AUTH_URL = "https://api.helloasso.com/oauth2/token"

def save_response(data):

    # Create a new refresh token
    RefreshToken.objects.create(
        token=data["refresh_token"],
        creation_date=datetime.now(tz=timezone.utc),
        expiration_date=datetime.now(tz=timezone.utc)+timedelta(days=30),
    )

    # Create a new access token
    access_token = AccessToken.objects.create(
        token=data["access_token"],
        creation_date=datetime.now(tz=timezone.utc),
        expiration_date=datetime.now(tz=timezone.utc)+timedelta(seconds=data["expires_in"]),
    )
    return access_token


def new_refresh_token():
    payload = {
        "grant_type": "client_credentials",
        "client_id": HELLOASSO_CLIENT_ID,
        "client_secret": HELLOASSO_CLIENT_SECRET,
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(HELLOASSO_AUTH_URL, data=payload, headers=headers, timeout=60)

    if not response.ok:
        raise Exception("Failed to get refresh token")

    data = response.json()
    return save_response(data)


def new_access_token():
    # Get the refresh token
    try:
        refresh_token = RefreshToken.objects.get(is_active=True, expiration_date__gte=datetime.now(tz=timezone.utc))
    except RefreshToken.DoesNotExist:
        return new_refresh_token()

    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token.token,
    }
    headers = {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post(HELLOASSO_AUTH_URL, data=payload, headers=headers, timeout=60)

    if not response.ok:
        return new_refresh_token()

    data = response.json()

    # Deactivate the old refresh token
    refresh_token.is_active = False
    refresh_token.save()

    return save_response(data)


def get_token():
    # Get the access token
    try:
        access_token = AccessToken.objects.get(is_active=True, expiration_date__gte=datetime.now(tz=timezone.utc))
    except AccessToken.DoesNotExist:
        access_token = new_access_token()
    return access_token.token
