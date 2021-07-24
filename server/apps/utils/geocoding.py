""" Utils function to query geocoding."""
import requests
from typing import List
from urllib.parse import quote


from django.conf import settings


def geocode(search: str) -> List[str]:
		results = requests.get(
				f'https://api.mapbox.com/geocoding/v5/mapbox.places/'
				f'{quote(search)}.json'
				'?proximity=-1.5541362,47.2186371'
				'&autocomplete=true'
				'&language=fr'
				'&types=address'
				'&limit=3'
				f'&access_token={settings.MAPBOX_API_KEY}')
		if results.status_code == 200:
			return [{
					'place_name': x['place_name'],
					'long': x['geometry']['coordinates'][0],
					'lat': x['geometry']['coordinates'][1]
			} for x in results.json()['features']]
		else:
			return [{
				'place_name': 'Ecole Centrale',
				'long': '47.2186371',
				'lat': '-1.5541362'
			}]

