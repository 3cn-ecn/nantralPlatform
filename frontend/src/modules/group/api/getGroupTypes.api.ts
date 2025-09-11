import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

import { adaptGroupTypePreview } from '../infra/groupType.adapter';
import { GroupTypePreviewDTO } from '../infra/groupType.dto';
import { GroupTypePreview } from '../types/groupType.types';

export async function getGroupTypesApi(
  isMap: boolean | null = null,
): Promise<Page<GroupTypePreview>> {
  const { data } = await axios
    .get<
      PageDTO<GroupTypePreviewDTO>
    >('/api/group/grouptype/', { params: { is_map: isMap } })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptPage(data, adaptGroupTypePreview);
}
