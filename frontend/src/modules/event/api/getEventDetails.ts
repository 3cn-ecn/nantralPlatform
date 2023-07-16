import axios from 'axios';

import { Event } from '../event.type';
import { adaptEvent } from '../infra/event.adapter';
import { EventDTO } from '../infra/event.dto';

export async function getEventDetails(id: number): Promise<Event> {
  const { data } = await axios.get<EventDTO>(`/api/event/event/${id}/`);

  return adaptEvent(data);
}
