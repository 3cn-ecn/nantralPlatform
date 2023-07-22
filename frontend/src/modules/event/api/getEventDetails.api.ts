import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { Event } from '../event.type';
import { adaptEvent } from '../infra/event.adapter';
import { EventDTO } from '../infra/event.dto';

export async function getEventDetailsApi(id: number): Promise<Event> {
  const { data } = await axios
    .get<EventDTO>(`/api/event/event/${id}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptEvent(data);
}
