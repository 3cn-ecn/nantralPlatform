import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptAdminRequest } from '../infra/adminRequest.adapter';
import { AdminRequestDTO } from '../infra/adminRequest.dto';
import { AdminRequest } from '../types/adminRequest.type';

interface GetAdminRequestListOptions {
  page?: number;
  pageSize?: number;
}

export async function getAdminRequestListApi(
  slug: string,
  options: GetAdminRequestListOptions,
): Promise<Page<AdminRequest>> {
  const { data } = await axios
    .get<
      PageDTO<AdminRequestDTO>
    >(`/api/group/admin_request/${slug}/`, { params: { page: options.page, page_size: options.pageSize } })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptAdminRequest);
}
