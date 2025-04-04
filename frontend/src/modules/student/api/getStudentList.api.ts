import axios from 'axios';

import { PageDTO, adaptPage } from '#shared/infra/pagination';

import { adaptStudent } from '../infra/student.adapter';
import { StudentDTO } from '../infra/student.dto';

interface GetStudentListApiParams {
  search?: string;
  pageSize?: number;
  page?: number;
}

export async function getStudentListApi(options: GetStudentListApiParams) {
  const { data } = await axios.get<PageDTO<StudentDTO>>(
    '/api/student/student/',
    {
      params: {
        search: options.search,
        page: options.page,
        page_size: options.pageSize,
      },
    },
  );

  return adaptPage(data, adaptStudent);
}
