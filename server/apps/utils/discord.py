from typing import List
from django.conf import settings
import requests
import json

BASE_URL = 'https://discord.com/api'
AUTH_HEADER = {
    'Authorization': f'Bot {settings.DISCORD_TOKEN}'}


def send_message(channel_id: int, message: str, embeds: List[dict] = None) -> str:
    payload = {
        'content': message
    }
    if embeds is not None:
        payload['embeds'] = embeds
    resp = requests.post(
        f'{BASE_URL}/channels/{channel_id}/messages', json=payload,
        headers=AUTH_HEADER)
    return resp.json()['id']


def react_message(channel_id: int, message_id: str, emjoi: str):
    requests.put(
        f'{BASE_URL}/channels/{channel_id}/messages/{message_id}/reactions/{emjoi}/@me',
        headers=AUTH_HEADER)
