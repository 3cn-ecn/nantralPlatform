import axios from 'axios';

import { adaptApiFormErrors } from '#shared/infra/errors';

export async function changeEmailVisibilityApi(
  emailId: number,
  isVisible: boolean,
): Promise<string> {
  const { data } = await axios
    .put(`/api/account/email/${emailId}/visibility/`, {
      is_visible: isVisible,
    })
    .catch((e) => {
      throw adaptApiFormErrors(e);
    });
  return data.message;
}
