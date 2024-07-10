import axios from 'axios';

export async function deleteMembershipApi(id: number) {
  const { status } = await axios
    .delete(`/api/group/membership/${id}/`)
    .catch((err) => {
      throw err;
    });
  return status;
}
