from django.conf import settings

import requests
from discord_webhook import DiscordEmbed, DiscordWebhook

BASE_URL = "https://discord.com/api"
AUTH_HEADER = {"Authorization": f"Bot {settings.DISCORD_TOKEN}"}


def send_message(
    channel_id: int,
    message: str,
    embeds: list[dict] | None = None,
) -> str:
    payload = {"content": message}
    if embeds is not None:
        payload["embeds"] = embeds
    resp = requests.post(
        f"{BASE_URL}/channels/{channel_id}/messages",
        json=payload,
        headers=AUTH_HEADER,
        timeout=10,
    )

    return resp.json()["id"]


def react_message(channel_id: int, message_id: str, emoji: str):
    requests.put(
        (
            f"{BASE_URL}/channels/{channel_id}/"
            f"messages/{message_id}/reactions/{emoji}/@me"
        ),
        headers=AUTH_HEADER,
        timeout=10,
    )


def send_admin_request(title: str, description: str, url: str):
    webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
    embed = DiscordEmbed(
        title=title,
        description=description,
        color=242424,
    )
    embed.add_embed_field(
        name="Voir la demande",
        value=f"[Voir la demande]({url})",
        inline=True,
    )
    webhook.add_embed(embed)
    webhook.execute()


def respond_admin_request(title: str, description: str = "", color=00000):
    webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
    embed = DiscordEmbed(
        title=title,
        description=description,
        color=color,
    )
    webhook.add_embed(embed)
    webhook.execute()
