import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { MembershipDTO } from '../infra/membership.dto';

interface ReorderMemberApiParams {
  member: number;
  lower?: number;
  group?: string;
}

export async function reorderMembershipApi(options: ReorderMemberApiParams) {
  const { status } = await axios
    .post<MembershipDTO>(
      '/api/group/membership/reorder/',
      {
        member: options.member,
        lower: options?.lower,
      },
      { params: { group: options?.group } },
    )
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return status;
}
