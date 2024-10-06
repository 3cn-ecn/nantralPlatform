import axios from 'axios';

import {
  ApiErrorDTO,
  adaptApiErrors,
  ApiFormError,
} from '#shared/infra/errors';

export async function changePasswordApi({
  oldPassword,
  newPassword,
  confirmNewPassword,
}: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  if (confirmNewPassword !== newPassword) {
    const error: ApiFormError<{
      old_password: string;
      new_password: string;
      confirm_new_password: string;
    }> = {
      fields: { confirm_new_password: ['Password must match'] },
      globalErrors: [],
      isAxiosError: false,
      message: '',
      name: '',
      toJSON: () => ({}),
    };
    throw error;
  }
  const { status } = await axios
    .post('/api/account/change_password/', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return status;
}
