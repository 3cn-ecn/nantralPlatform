import axios from 'axios';

import { EmailDTO } from '#modules/account/infra/email.dto';
import { adaptApiFormErrors } from '#shared/infra/errors';

export async function changeEmailVisibilityApi(
  emailUuid: string,
  isVisible: boolean,
): Promise<EmailDTO> {
  const { data } = await axios
    .put(`/api/account/email/${emailUuid}/`, { is_visible: isVisible })
    .catch((e) => {
      throw adaptApiFormErrors(e);
    });
  return data;
}
