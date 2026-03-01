import axios, { AxiosResponse } from 'axios';

import { adaptGroupHistory } from '#modules/group/infra/groupHistory.adapter';
import { convertGroupHistoryForm } from '#modules/group/infra/groupHistory.converter';
import {
  GroupHistoryDTO,
  GroupHistoryFormDTO,
} from '#modules/group/infra/groupHistory.dto';
import { GroupHistoryForm } from '#modules/group/types/groupHistory.type';
import { adaptApiFormErrors, ApiFormErrorDTO } from '#shared/infra/errors';

export async function updateGroupHistoryApi(
  slug: string,
  pk: number,
  formData: GroupHistoryForm,
) {
  const { data } = await axios
    .put<
      GroupHistoryFormDTO,
      AxiosResponse<GroupHistoryDTO>
    >(`/api/group/group/${slug}/history/${pk}/`, convertGroupHistoryForm(formData))
    .catch((err: ApiFormErrorDTO<GroupHistoryFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptGroupHistory(data);
}
