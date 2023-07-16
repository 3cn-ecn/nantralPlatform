import axios from 'axios';

export async function registerAsParticipant(id: number) {
  const { status } = await axios.post(`/api/event/event/${id}/participate/`);
  return status;
}
