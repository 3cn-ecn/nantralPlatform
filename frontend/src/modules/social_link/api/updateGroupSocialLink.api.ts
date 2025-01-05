import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptSocialLinkForm } from '../infra/socialLink.adapter';
import { convertSocialLinkForm } from '../infra/socialLink.converter';
import { SocialLinkForm } from '../types/socialLink.type';

export async function updateSocialLinkApi(
  form: SocialLinkForm,
  type: 'user' | 'group',
) {
  const { data } = await axios
    .put<SocialLinkForm>(
      `/api/sociallink/${type}/${form.id}/`,
      convertSocialLinkForm(form),
    )
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptSocialLinkForm(data);
}
