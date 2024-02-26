import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptGroupTypePreview } from '../infra/groupType.adapter';
import { GroupTypePreviewDTO } from '../infra/groupType.dto';
import { GroupTypePreview } from '../types/groupType.types';

export async function getGroupTypeDetailsApi(
  slug: string,
): Promise<GroupTypePreview> {
  const { data } = await axios
    .get<GroupTypePreviewDTO>(`/api/group/grouptype/${slug}`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  return adaptGroupTypePreview(data);
}
