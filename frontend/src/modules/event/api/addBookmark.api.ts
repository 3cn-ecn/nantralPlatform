import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function addBookmarkApi(id: number) {
  const { status } = await axios
    .post(`/api/event/event/${id}/bookmark/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
