import axios, { GenericAbortSignal } from 'axios';

import { adaptStudent } from '../infra/student.adapter';
import { StudentDTO } from '../infra/student.dto';
import { Student } from '../student.types';

interface GetCurrentUserApiParams {
  signal?: GenericAbortSignal;
}

export async function getCurrentUserApi({
  signal,
}: GetCurrentUserApiParams): Promise<Student> {
  const { data } = await axios.get<StudentDTO>('/api/account/user/me/', {
    signal,
  });

  return adaptStudent(data);
}
