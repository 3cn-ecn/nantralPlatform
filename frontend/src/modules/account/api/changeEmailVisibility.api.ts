import axios from 'axios';

import { adaptApiFormErrors } from '#shared/infra/errors';

export async function changeEmailVisibilityApi(
  emailUuid: string,
  isVisible: boolean,
  user: number,
): Promise<string> {
  const { data } = await axios
    .put(
      `/api/account/email/${emailUuid}/visibility/`,
      { is_visible: isVisible },
      { params: { user } },
    )
    .catch((e) => {
      throw adaptApiFormErrors(e);
    });
  return data.message;
}
