import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptSportEventDTO } from '../infra/sportevent.adapter';
import { SportEventDTO } from '../infra/sportevent.dto';
import { SportEvent } from '../sportevent.type';

export async function getSportEventDetailsApi(id: number): Promise<SportEvent> {
  const { data } = await axios
    .get<SportEventDTO>(`/api/event/sport/${id}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptSportEventDTO(data);
}
