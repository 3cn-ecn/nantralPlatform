import axios from 'axios';

import { adaptGroupHistory } from '#modules/group/infra/groupHistory.adapter';
import { GroupHistoryDTO } from '#modules/group/infra/groupHistory.dto';
import { GroupHistory } from '#modules/group/types/groupHistory.type';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

export async function getGroupHistoryListApi(
  slug: string,
): Promise<Page<GroupHistory>> {
  const { data } = await axios
    .get<PageDTO<GroupHistoryDTO>>(`/api/group/group/${slug}/history/`)
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptGroupHistory);
}
