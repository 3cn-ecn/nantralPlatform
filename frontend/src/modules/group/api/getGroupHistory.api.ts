import axios from 'axios';

import { adaptGroupHistory } from '#modules/group/infra/groupHistory.adapter';
import { GroupHistoryDTO } from '#modules/group/infra/groupHistory.dto';
import { GroupHistory } from '#modules/group/types/groupHistory.type';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';

export async function getGroupHistoryApi(
  slug: string,
  pk: number,
): Promise<GroupHistory> {
  const { data } = await axios
    .get<GroupHistoryDTO>(`/api/group/group/${slug}/history/${pk}`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptGroupHistory(data);
}
