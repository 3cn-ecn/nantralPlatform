import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptSocialLinkForm } from '../infra/socialLink.adapter';
import { convertSocialLinkForm } from '../infra/socialLink.converter';
import { SocialLinkForm } from '../types/socialLink.type';

export async function createGroupSocialLinkApi(
  group_slug: string,
  form: SocialLinkForm,
) {
  const { data } = await axios
    .post<SocialLinkForm>('/api/sociallink/sociallink/', {
      ...convertSocialLinkForm(form),
      group: group_slug,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptSocialLinkForm(data);
}
