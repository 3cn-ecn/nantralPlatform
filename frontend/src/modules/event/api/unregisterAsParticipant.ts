import axios from 'axios';

export async function unregisterAsParticipant(id: number) {
  const { status } = await axios.delete(`/api/event/event/${id}/participate/`);
  return status;
}
