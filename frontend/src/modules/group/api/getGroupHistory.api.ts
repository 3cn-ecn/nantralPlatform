import axios from 'axios';

import { adaptGroupHistory } from '#modules/group/infra/groupHistory.adapter';
import { GroupHistoryDTO } from '#modules/group/infra/groupHistory.dto';
import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';

export async function getGroupHistoryApi(slug: string) {
  const { data } = await axios
    .get<GroupHistoryDTO[]>(`/api/group/group/${slug}/history/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return data.map(adaptGroupHistory);
}
