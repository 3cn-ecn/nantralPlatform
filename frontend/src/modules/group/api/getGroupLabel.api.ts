import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { PageDTO, adaptPage } from '#shared/infra/pagination';

import { Label } from '../types/label.type';

export async function getGroupLabelApi(options: {
  groupType?: string;
  page?: number;
  pageSize?: number;
}) {
  const { data } = await axios
    .get<PageDTO<Label>>('/api/group/label/', {
      params: {
        group_type: options.groupType,
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, (e) => e);
}
