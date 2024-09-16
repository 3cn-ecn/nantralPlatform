import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { SocialLinkForm } from '../types/socialLink.type';

export async function deleteSocialLinkApi(id: number, type: 'user' | 'group') {
  await axios
    .delete<SocialLinkForm>(`/api/sociallink/${type}/${id}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return;
}
