import axios from 'axios';

import { Page, PageDTO, adaptPage } from '#shared/utils/pagination';

import { adaptPostPreview } from '../infra/post.adapter';
import { PostPreviewDTO } from '../infra/post.dto';
import { PostPreview } from '../post.types';

type GetPostListParams = {
  pinned?: boolean;
  isMember?: boolean;
  minDate?: Date;
  maxDate?: Date;
  search?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
};

export async function getPostList(
  options: GetPostListParams
): Promise<Page<PostPreview>> {
  const { data } = await axios.get<PageDTO<PostPreviewDTO>>('/api/post/post/', {
    params: {
      pinned: options.pinned,
      is_member: options.isMember,
      min_date: options.minDate,
      max_date: options.maxDate,
      search: options.search,
      ordering: options.ordering,
      page: options.page,
      page_size: options.pageSize,
    },
  });

  return adaptPage(data, adaptPostPreview);
}
