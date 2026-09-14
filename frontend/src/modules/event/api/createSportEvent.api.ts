import axios, { AxiosResponse } from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { adaptSportEventDTO } from '../infra/sportevent.adapter';
import { convertSportEventForm } from '../infra/sportevent.converter';
import { SportEventDTO, SportEventFormDTO } from '../infra/sportevent.dto';
import { SportEventForm } from '../sportevent.type';

export async function createSportEventApi(formData: SportEventForm) {
  const { data } = await axios
    .post<SportEventFormDTO, AxiosResponse<SportEventDTO>>(
      '/api/event/sport/',
      convertSportEventForm(formData),
    )
    .catch((err: ApiFormErrorDTO<SportEventFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptSportEventDTO(data);
}
