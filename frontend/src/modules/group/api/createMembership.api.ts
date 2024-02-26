import axios, { AxiosResponse } from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { adaptMembership } from '../infra/membership.adapter';
import { convertMembershipForm } from '../infra/membership.converter';
import { MembershipDTO, MembershipFormDTO } from '../infra/membership.dto';
import { MembershipForm } from '../types/membership.types';

export async function createMembershipApi(formData: MembershipForm) {
  const { data } = await axios
    .post<
      MembershipFormDTO,
      AxiosResponse<MembershipDTO>
    >('/api/group/membership/', convertMembershipForm(formData))
    .catch((err: ApiFormErrorDTO<MembershipFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptMembership(data);
}
