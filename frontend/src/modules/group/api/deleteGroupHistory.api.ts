import axios from 'axios';

import { adaptApiErrors } from '#shared/infra/errors';

export async function deleteGroupHistoryApi(slug: string, pk: number) {
  const { status } = await axios
    .delete(`/api/group/group/${slug}/history/${pk}/`)
    .catch((err) => {
      throw adaptApiErrors(err);
    });
  return status;
}
