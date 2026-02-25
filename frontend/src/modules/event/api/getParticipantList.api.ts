import axios from 'axios';

import { adaptUserPreview } from '#modules/account/infra/user.adapter';
import { UserPreviewDTO } from '#modules/account/infra/user.dto';
import { UserPreview } from '#modules/account/user.types';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

interface GetParticipantListOptions {
  page?: number;
  pageSize?: number;
}

export async function getParticipantListApi(
  eventId: number,
  options: GetParticipantListOptions,
): Promise<Page<UserPreview>> {
  const { data } = await axios
    .get<PageDTO<UserPreviewDTO>>(`/api/event/event/${eventId}/participants/`, {
      params: {
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptUserPreview);
}
