import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { EventForm } from '../event.type';
import { convertEventForm } from '../infra/event.converter';
import { EventFormDTO } from '../infra/event.dto';

export type UpdateEventVariables = {
  id: number;
  data: EventForm;
};

export async function updateEvent({ id, data }: UpdateEventVariables) {
  await axios
    .putForm<EventFormDTO>(`/api/event/event/${id}/`, convertEventForm(data))
    .catch((err: ApiErrorDTO<EventFormDTO>) => {
      throw adaptApiErrors(err);
    });
}
