import axios from 'axios';

import { Geocode } from '#modules/map/geocode.type';
import { adaptGeocode } from '#modules/map/infra/geocode.adapter';
import { adaptApiErrors } from '#shared/infra/errors';

export async function getGeocodeListApi(search: string) {
  const { data } = await axios
    .get<Geocode[]>('/api/group/map/geocode/', {
      params: { search },
    })
    .catch((error) => {
      throw adaptApiErrors(error);
    });
  return data.map((value) => adaptGeocode(value));
}
