import axios from 'axios';

import { adaptStudent } from '../infra/student.adapter';
import { StudentDTO } from '../infra/student.dto';
import { Student } from '../student.types';

interface GetStudentDetailsApiParams {
  id: number;
}

export async function getStudentDetailsApi({
  id,
}: GetStudentDetailsApiParams): Promise<Student> {
  const { data } = await axios.get<StudentDTO>(`/api/student/student/${id}/`);
  return adaptStudent(data);
}
