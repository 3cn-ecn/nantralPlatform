import axios from 'axios';

import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { GroupPreview } from '../group.type';
import { adaptGroupPreview } from '../infra/group.adapter';
import { GroupPreviewDTO } from '../infra/group.dto';

type GetGroupListParams = {
  groupTypeSlug?: string;
  isMember?: boolean;
  isAdmin?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
};

export async function getGroupList(
  options: GetGroupListParams
): Promise<Page<GroupPreview>> {
  const { data } = await axios.get<PageDTO<GroupPreviewDTO>>(
    '/api/group/group/',
    {
      params: {
        type: options.groupTypeSlug,
        is_member: options.isMember,
        is_admin: options.isAdmin,
        search: options.search,
        page: options.page,
        page_size: options.pageSize,
      },
    }
  );

  return adaptPage(data, adaptGroupPreview);
}
