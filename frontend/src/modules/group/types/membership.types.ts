import { StudentPreview } from '#modules/student/student.types';

import { GroupPreview } from '../group.type';

export interface Membership {
  id: number;
  student: StudentPreview;
  group: GroupPreview;
  summary: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  priority: number;
  admin: boolean;
  adminRequest: string;
}
