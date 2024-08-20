import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptSocialNetwork } from '../infra/socialNetork.adapter';
import { SocialNetworkDTO } from '../infra/socialNetwork.dto';
import { SocialNetwork } from '../types/socialNetwork.type';

export async function getSocialNetworksApi(): Promise<Page<SocialNetwork>> {
  const { data } = await axios
    .get<PageDTO<SocialNetworkDTO>>('/api/sociallink/socialnetwork/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptSocialNetwork);
}
