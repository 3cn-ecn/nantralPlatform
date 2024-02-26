import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptGroupTypePreview } from '../infra/groupType.adapter';
import { GroupTypePreviewDTO } from '../infra/groupType.dto';
import { GroupTypePreview } from '../types/groupType.types';

export async function getGroupTypesApi(): Promise<Page<GroupTypePreview>> {
  const { data } = await axios
    .get<PageDTO<GroupTypePreviewDTO>>('/api/group/grouptype/')
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptGroupTypePreview);
}
