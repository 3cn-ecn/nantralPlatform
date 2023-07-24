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
    .put<EventFormDTO>(`/api/event/event/${id}/`, convertEventForm(data), {
      // convert data to FormData object only if there is an image,
      // because FormData removes fields with null values
      headers: data.image ? { 'Content-Type': 'multipart/form-data' } : {},
    })
    .catch((err: ApiFormErrorDTO<EventFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
}
