import axios, { GenericAbortSignal } from 'axios';

import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptSentNotification } from '../infra/notification.adapter';
import { SentNotificationDTO } from '../infra/notification.dto';
import { SentNotification } from '../notification.types';

export type NotificationListQueryParams = {
  subscribed?: boolean | null;
  seen?: boolean | null;
  search?: string | null;
  page?: number | null;
  pageSize?: number | null;
};

export async function getNotificationListApi(
  params: NotificationListQueryParams = {},
  signal?: GenericAbortSignal
): Promise<Page<SentNotification>> {
  const { data } = await axios
    .get<PageDTO<SentNotificationDTO>>('/api/notification/notification/', {
      params: {
        subscribed: params.subscribed,
        seen: params.seen,
        search: params.search,
        page: params.page,
        page_size: params.pageSize,
      },
      signal: signal,
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptSentNotification);
}
