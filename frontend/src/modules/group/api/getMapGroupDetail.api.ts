import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

import { adaptMapGroupPreview } from '../infra/group.adapter';
import { MapGroupPreviewDTO } from '../infra/group.dto';
import { MapGroupPreview } from '../types/group.types';

export async function getMapGroupDetailApi(
  slug: string,
): Promise<MapGroupPreview> {
  const { data } = await axios
    .get<MapGroupPreviewDTO>(`/api/group/group/${slug}/`, {
      params: {
        map: true,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptMapGroupPreview(data);
}
