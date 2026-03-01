import axios from 'axios';

import { adaptApiErrors } from '#shared/infra/errors';

export async function restoreGroupHistoryApi(slug: string, pk: number) {
  const { status } = await axios
    .post(`/api/group/group/${slug}/history/${pk}/restore/`)
    .catch((err) => {
      throw adaptApiErrors(err);
    });
  return status;
}
