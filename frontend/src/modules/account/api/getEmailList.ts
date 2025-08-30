import axios from 'axios';

import { Email } from '#modules/account/email.type';
import { adaptEmail } from '#modules/account/infra/email.adapter';
import { EmailDTO } from '#modules/account/infra/email.dto';
import { ApiErrorDTO, adaptApiErrors } from '#shared/infra/errors';
import { Page, PageDTO, adaptPage } from '#shared/infra/pagination';

interface GetEmailListOptions {
  page?: number;
  pageSize?: number;
}

export async function getEmailListApi(
  options: GetEmailListOptions,
): Promise<Page<Email>> {
  const { data } = await axios
    .get<PageDTO<EmailDTO>>('/api/account/email/', {
      params: {
        page: options.page,
        page_size: options.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptEmail);
}
