import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

interface SendAdminRequestApiParams {
  membership: number;
  message?: string;
}

export async function sendAdminRequestApi(options: SendAdminRequestApiParams) {
  const { data } = await axios
    .post<{ detail: string }>(
      `/api/group/membership/${options.membership}/admin_request/`,
      {
        message: options.message,
      },
    )
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return data;
}
