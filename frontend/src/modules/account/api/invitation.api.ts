import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function validateInvitationApi(uuid: string) {
  const { status } = await axios
    .post('/api/account/validate_invitation/', {
      uuid: uuid,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
