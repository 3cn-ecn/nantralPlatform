import axios from 'axios';

import { OrderingField } from '#shared/api/orderingFields.types';
import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptPostPreview } from '../infra/post.adapter';
import { PostDTO, PostPreviewDTO } from '../infra/post.dto';
import { PostPreview } from '../post.types';

type GetPostListParams = {
  group?: string[];
  pinned?: boolean;
  isMember?: boolean;
  minDate?: Date;
  maxDate?: Date;
  search?: string;
  ordering?: OrderingField<PostDTO>[];
  page?: number;
  pageSize?: number;
};

export async function getPostListApi(
  options: GetPostListParams
): Promise<Page<PostPreview>> {
  const { data } = await axios
    .get<PageDTO<PostPreviewDTO>>('/api/post/post/', {
      params: {
        group: options.group,
        pinned: options.pinned,
        is_member: options.isMember,
        min_date: options.minDate,
        max_date: options.maxDate,
        search: options.search,
        ordering: options.ordering?.join(','),
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptPostPreview);
}
