import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

interface SendAdminRequestApiParams {
  group: string;
  message?: string;
}

export async function SendAdminRequestApi(options: SendAdminRequestApiParams) {
  const { data } = await axios
    .post<{ detail: string }>(
      `/api/group/group/${options.group}/admin_request/`,
      {
        message: options.message,
      },
    )
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return data;
}
