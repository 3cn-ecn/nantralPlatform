import axios, { GenericAbortSignal } from 'axios';

import { adaptStudent } from '../infra/student.adapter';
import { StudentDTO } from '../infra/student.dto';
import { Student } from '../student.types';

type GetCurrentUserApiParams = {
  signal?: GenericAbortSignal;
};

export async function getCurrentUserApi({
  signal,
}: GetCurrentUserApiParams): Promise<Student> {
  const { data } = await axios.get<StudentDTO>('/api/student/student/me/', {
    signal,
  });

  return adaptStudent(data);
}
