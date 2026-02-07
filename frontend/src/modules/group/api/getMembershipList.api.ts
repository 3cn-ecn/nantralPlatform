import axios from 'axios';

import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptMembership } from '../infra/membership.adapter';
import { MembershipDTO } from '../infra/membership.dto';

export interface GetMembershipListApiParams {
  student?: number;
  group?: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  groupType?: string;
}

export async function getMembershipListApi(
  options: GetMembershipListApiParams,
) {
  const { data } = await axios
    .get<PageDTO<MembershipDTO>>('/api/group/membership/', {
      params: {
        user: options.student,
        from: options.from?.toISOString(),
        to: options.to?.toISOString(),
        group: options.group,
        page: options.page,
        page_size: options.pageSize,
        ordering: options.orderBy,
        group_type: options?.groupType,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptMembership);
}
