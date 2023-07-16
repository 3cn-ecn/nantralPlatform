import axios from 'axios';

export async function removeBookmark(id: number) {
  const { status } = await axios.delete(`/api/event/event/${id}/bookmark/`);
  return status;
}
