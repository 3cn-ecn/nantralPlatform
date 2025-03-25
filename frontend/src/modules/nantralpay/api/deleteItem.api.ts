import axios from 'axios';

export async function deleteItemApi(id: number) {
  const { status } = await axios
    .delete(`/api/nantralpay/item/${id}/`)
    .catch((err) => {
      throw err;
    });
  return status;
}
