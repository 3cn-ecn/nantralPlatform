import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptGroupPreview } from '../infra/group.adapter';
import { GroupPreviewDTO } from '../infra/group.dto';
import { GroupPreview } from '../types/group.types';

export interface GetGroupListApiParams {
  type?: string | null;
  isMember?: boolean | null;
  isAdmin?: boolean | null;
  slug?: string | string[] | null;
  search?: string | null;
  page?: number | null;
  pageSize?: number | null;
  parent?: string | string[] | null;
}

export async function getGroupListApi(
  options: GetGroupListApiParams,
): Promise<Page<GroupPreview>> {
  const { data } = await axios
    .get<PageDTO<GroupPreviewDTO>>('/api/group/group/', {
      params: {
        type: options.type,
        is_member: options.isMember,
        is_admin: options.isAdmin,
        slug: options.slug,
        search: options.search,
        page: options.page,
        page_size: options.pageSize,
        parent: options.parent,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptGroupPreview);
}
