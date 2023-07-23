import axios from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { EventForm } from '../event.type';
import { convertEventForm } from '../infra/event.converter';
import { EventFormDTO } from '../infra/event.dto';

export type UpdateEventApiVariables = {
  id: number;
  data: EventForm;
};

export async function updateEventApi({ id, data }: UpdateEventApiVariables) {
  await axios
    .putForm<EventFormDTO>(`/api/event/event/${id}/`, convertEventForm(data))
    .catch((err: ApiFormErrorDTO<EventFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
}
