import axios from 'axios';

import { Email } from '#modules/account/email.type';
import { adaptEmail } from '#modules/account/infra/email.adapter';
import { EmailDTO } from '#modules/account/infra/email.dto';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

interface GetEmailListOptions {
  page?: number;
  pageSize?: number;
}

export async function getEmailListApi(
  options: GetEmailListOptions,
  user: number,
): Promise<Page<Email>> {
  const { data } = await axios
    .get<PageDTO<EmailDTO>>('/api/account/email/', {
      params: {
        page: options.page,
        page_size: options.pageSize,
        user,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptEmail);
}
