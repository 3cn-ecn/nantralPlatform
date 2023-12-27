import axios from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

import { adaptGroup } from '../infra/group.adapter';
import { GroupDTO } from '../infra/group.dto';
import { Group } from '../types/group.types';

export async function getGroupDetailsApi(slug: string): Promise<Group> {
  const { data } = await axios
    .get<GroupDTO>(`/api/group/group/${slug}/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptGroup(data);
}
