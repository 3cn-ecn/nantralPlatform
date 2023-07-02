import axios from 'axios';

import {
  FormEventProps,
  eventToCamelCase,
  registrationType,
} from '#types/Event';

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
    .post('/api/event/', createForm(options, registrationMode), {
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

export async function register(id: number): Promise<{ success: boolean }> {
  return axios.post(`/api/event/${id}/participate`).then((res) => res.data);
}

export async function unregister(id: number): Promise<{ success: boolean }> {
  return axios.delete(`/api/event/${id}/participate`).then((res) => res.data);
}