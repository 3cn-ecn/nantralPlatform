import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

import { adaptGroupThematic } from '../infra/groupThematic.adapter';
import { GroupThematicDTO } from '../infra/groupThematic.dto';
import { GroupThematic } from '../types/groupThematic.types';

export async function getGroupThematicsApi(options: {
  page?: number;
  pageSize?: number;
}): Promise<Page<GroupThematic>> {
  const { data } = await axios
    .get<PageDTO<GroupThematicDTO>>('/api/group/thematic/', {
      params: {
        page: options.page,
        pageSize: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptGroupThematic);
}
