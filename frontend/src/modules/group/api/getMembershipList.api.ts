import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptMembership } from '../infra/membership.adapter';
import { MembershipDTO } from '../infra/membership.dto';

interface GetMembershipListApiParams {
  student?: number;
  group?: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
}

export async function getMembershipListApi(
  options: GetMembershipListApiParams,
) {
  const { data } = await axios
    .get<PageDTO<MembershipDTO>>('/api/group/membership/', {
      params: {
        student: options.student,
        from: options.from?.toISOString(),
        to: options.to?.toISOString(),
        group: options.group,
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptMembership);
}
