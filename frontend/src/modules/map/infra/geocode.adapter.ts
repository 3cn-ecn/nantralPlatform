import { Geocode } from '#modules/map/geocode.type';
import { GeocodeDTO } from '#modules/map/infra/geocode.dto';

export function adaptGeocode(geocodeDto: GeocodeDTO): Geocode {
  return { ...geocodeDto };
}
