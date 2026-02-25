import axios from 'axios';

import { adaptPage, PageDTO } from '#shared/infra/pagination';

import { adaptUser } from '../infra/user.adapter';
import { UserDTO } from '../infra/user.dto';

export interface GetUserListApiParams {
  search?: string;
  pageSize?: number;
  page?: number;
  promo?: number;
  path?: string;
  faculty?: string;
}

export async function getUserListApi(options: GetUserListApiParams) {
  const { data } = await axios.get<PageDTO<UserDTO>>('/api/account/user/', {
    params: {
      search: options.search,
      page: options.page,
      page_size: options.pageSize,
      promo: options.promo,
      path: options.path,
      faculty: options.faculty,
    },
  });

  return adaptPage(data, adaptUser);
}
