import axios, { AxiosResponse } from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { EventForm } from '../event.type';
import { adaptEvent } from '../infra/event.adapter';
import { convertEventForm } from '../infra/event.converter';
import { EventDTO, EventFormDTO } from '../infra/event.dto';

export async function createEventApi(formData: EventForm) {
  const { data } = await axios
    .post<EventFormDTO, AxiosResponse<EventDTO>>(
      '/api/event/event/',
      convertEventForm(formData),
      {
        // convert data to FormData object only if there is an image,
        // because FormData removes fields with null values
        headers: formData.image
          ? { 'Content-Type': 'multipart/form-data' }
          : {},
      }
    )
    .catch((err: ApiFormErrorDTO<EventFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptEvent(data);
}
