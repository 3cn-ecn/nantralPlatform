import axios from 'axios';

import { Page, PageDTO, adaptPage } from '#shared/utils/pagination';

import { adaptPartialPost } from '../infra/post.adapter';
import { PartialPostDTO } from '../infra/post.dto';
import { PartialPost } from '../post.types';

type GetPostListParams = {
  pinned?: boolean;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  page: number;
  pageSize?: number;
};

export async function getPostList(
  options: GetPostListParams
): Promise<Page<PartialPost>> {
  const { data } = await axios.get<PageDTO<PartialPostDTO>>('/api/post/', {
    params: {
      pinned: options.pinned,
      from_date: options.fromDate,
      to_date: options.toDate,
      limit: options.limit,
      page: options.page,
      page_size: options.pageSize,
    },
  });

  return adaptPage(data, adaptPartialPost);
}
