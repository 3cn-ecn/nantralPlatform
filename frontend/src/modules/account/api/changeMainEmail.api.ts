import axios from 'axios';

import { EmailDTO } from '#modules/account/infra/email.dto';
import { adaptApiFormErrors } from '#shared/infra/errors';

export async function changeMainEmailApi(
  emailUuid: string,
  password: string,
): Promise<EmailDTO> {
  const { data } = await axios
    .put(`/api/account/email/${emailUuid}/`, { password, is_main: true })
    .catch((e) => {
      throw adaptApiFormErrors(e);
    });
  return data;
}
