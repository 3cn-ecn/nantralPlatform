import axios from 'axios';

export async function addBookmark(id: number) {
  const { status } = await axios.post(`/api/event/event/${id}/bookmark/`);
  return status;
}
