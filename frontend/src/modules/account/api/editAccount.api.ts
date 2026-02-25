import axios from 'axios';

import { adaptApiFormErrors, ApiFormErrorDTO } from '#shared/infra/errors';

export interface EditAccountOptions {
  firstName: string;
  lastName: string;
  description: string;
  picture: File | undefined;
  path: string;
  faculty: string;
  promo: number;
}

export interface EditAccountOptionsDTO {
  first_name: string;
  last_name: string;
  description: string;
  picture: string;
  faculty: string;
  path: string;
  promo: number;
}

export async function editAccountApi(
  formData: EditAccountOptions,
  user: number,
) {
  const { data } = await axios
    .put<EditAccountOptionsDTO>(
      `/api/account/user/${user}/`,
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        description: formData.description,
        picture: formData.picture,
        path: formData.path,
        faculty: formData.faculty,
        promo: formData.promo,
      },
      {
        // convert data to FormData object only if there is an image,
        // because FormData removes fields with null values
        headers: formData.picture
          ? { 'Content-Type': 'multipart/form-data' }
          : {},
      },
    )
    .catch((err: ApiFormErrorDTO<EditAccountOptionsDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return data;
}
