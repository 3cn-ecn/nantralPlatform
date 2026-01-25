import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptGroup } from '../infra/group.adapter';
import { GroupDTO } from '../infra/group.dto';
import { Group } from '../types/group.types';

export async function getGroupDetailsApi(
  slug: string,
  version?: number,
): Promise<Group> {
  const { data } = await axios
    .get<GroupDTO>(`/api/group/group/${slug}/`, {
      params: {
        version,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });
  console.log(data);
  return adaptGroup(data);
}
