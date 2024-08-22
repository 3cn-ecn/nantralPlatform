import axios from 'axios';

import { PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptStudent } from '../infra/student.adapter';
import { StudentDTO } from '../infra/student.dto';

export interface GetStudentListApiParams {
  search?: string;
  pageSize?: number;
  page?: number;
  promo?: number;
  path?: string;
  faculty?: string;
}

export async function getStudentListApi(options: GetStudentListApiParams) {
  const { data } = await axios.get<PageDTO<StudentDTO>>(
    '/api/student/student/',
    {
      params: {
        search: options.search,
        page: options.page,
        page_size: options.pageSize,
        promo: options.promo,
        path: options.path,
        faculty: options.faculty,
      },
    },
  );

  return adaptPage(data, adaptStudent);
}
