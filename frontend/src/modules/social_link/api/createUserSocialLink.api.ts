import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptSocialLinkForm } from '../infra/socialLink.adapter';
import { convertSocialLinkForm } from '../infra/socialLink.converter';
import { SocialLinkForm } from '../types/socialLink.type';

export async function createUserSocialLinkApi(form: SocialLinkForm) {
  const { data } = await axios
    .post<SocialLinkForm>('/api/sociallink/user/', convertSocialLinkForm(form))
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptSocialLinkForm(data);
}
