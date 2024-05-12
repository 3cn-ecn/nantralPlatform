"""Utils function to query geocoding."""

from urllib.parse import quote

from django.conf import settings

import requests
from rest_framework import status


def geocode(search: str, limit: int = 3) -> list[str]:
    results = requests.get(
        url=f"https://api.mapbox.com/geocoding/v5/mapbox.places/{quote(search)}.json",
        params={
            "proximity": "-1.5541362,47.2186371",
            "autocomplete": "true",
            "language": "fr",
            "types": "address",
            "limit": limit,
            "access_token": settings.MAPBOX_API_KEY,
        },
        timeout=20,
    )
    if results.status_code == status.HTTP_200_OK:
        return [
            {
                "place_name": x["place_name"],
                "long": x["geometry"]["coordinates"][0],
                "lat": x["geometry"]["coordinates"][1],
            }
            for x in results.json()["features"]
        ]
    else:
        return [
            {
                "place_name": "Ecole Centrale",
                "long": "-1.5541362",
                "lat": "47.2186371",
            },
        ]
