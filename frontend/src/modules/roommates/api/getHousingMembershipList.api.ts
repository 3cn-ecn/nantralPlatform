import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptRoommatesMembership } from '../infra/roommates.adapter';
import { RoommatesMembershipDTO } from '../infra/roommates.dto';

export async function getHousingMembershipListApi(options?: {
  student?: number;
  page?: number;
  pageSize?: number;
}) {
  const { data } = await axios
    .get<
      PageDTO<RoommatesMembershipDTO>
    >('/api/colocs/membership/', { params: { student: options?.student, page: options?.page, page_size: options?.pageSize } })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptRoommatesMembership);
}
