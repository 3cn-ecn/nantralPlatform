import axios from 'axios';
import { isArray } from 'lodash-es';
import {
  EventProps,
  FormEventProps,
  eventToCamelCase,
  eventsToCamelCase,
  registrationType,
} from '../Props/Event';
import { Page } from '../Props/pagination';

export async function getEvents(
  options: {
    orderBy?: string[] | string;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
    offset?: number;
    isShotgun?: boolean;
    isFavorite?: boolean;
    minParticipants?: number;
    maxParticipants?: number;
    isMember?: boolean;
    isForm?: boolean;
    isParticipating?: boolean;
    publicity?: 'Mem' | 'Pub';
    registration?: 'open' | 'closed';
  } = {}
): Promise<Page<EventProps>> {
  return axios
    .get<Page<EventProps>>('/api/event/', {
      params: {
        from_date: options.fromDate,
        to_date: options.toDate,
        order_by: isArray(options.orderBy)
          ? options.orderBy.join(',')
          : options.orderBy,
        limit: options.limit,
        offset: options.offset,
        is_shotgun: options.isShotgun || undefined,
        is_favorite: options.isFavorite || undefined,
        min_participants: options.minParticipants,
        max_participants: options.maxParticipants,
        is_member: options.isMember || undefined,
        is_form: options.isForm || undefined,
        is_participating: options.isParticipating || undefined,
        publicity: options.publicity,
        registration: options.registration,
      },
    })
    .then((res) => {
      eventsToCamelCase(res.data.results);
      return res.data;
    });
}

export async function getEvent(id: number): Promise<EventProps> {
  const { data } = await axios.get(`/api/event/${id}/`);
  eventToCamelCase(data);
  return data;
}

function createForm(values: FormEventProps, mode: registrationType): FormData {
  const formData = new FormData();
  if (values.image && typeof values.image !== 'string')
    formData.append('image', values.image, values.image.name);
  if (values.group) formData.append('group', values.group.toString());
  formData.append('publicity', values.publicity);
  formData.append('title', values.title || '');
  formData.append('description', values.description || '<p></p>');
  if (values.startDate)
    formData.append('start_date', values.startDate.toISOString());
  if (values.endDate) formData.append('end_date', values.endDate.toISOString());
  formData.append(
    'end_registration',
    values.endRegistration ? values.endRegistration.toISOString() : ''
  );
  formData.append('location', values.location);
  // Form
  formData.append('form_url', mode === 'form' ? values.formUrl : ' ');
  // Shotgun
  formData.append(
    'max_participant',
    mode === 'shotgun' && values.maxParticipant
      ? values.maxParticipant.toString()
      : ''
  );
  formData.append(
    'start_registration',
    values.startRegistration ? values.startRegistration.toISOString() : ''
  );
  return formData;
}

export async function createEvent(
  options?: FormEventProps,
  registrationMode: registrationType = 'form'
): Promise<FormEventProps> {
  return axios
    .post(`/api/event/`, createForm(options, registrationMode), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((res) => {
      eventToCamelCase(res.data);
      return res.data;
    });
}

export async function editEvent(
  id: number,
  options?: FormEventProps,
  registrationMode: registrationType = 'form'
): Promise<FormEventProps> {
  return axios
    .put(`/api/event/${id}/`, createForm(options, registrationMode), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((res) => {
      eventToCamelCase(res.data);
      return res.data;
    });
}

export function deleteEvent(id: number): Promise<void> {
  return axios.delete(`/api/event/${id}/`);
}
