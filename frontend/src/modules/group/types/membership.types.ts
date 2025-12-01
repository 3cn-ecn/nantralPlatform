import { StudentPreview } from '#modules/student/student.types';

import { GroupPreview } from './group.types';

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

export type MembershipForm = Pick<
  Membership,
  'beginDate' | 'endDate' | 'summary' | 'description' | 'admin'
> & { student: number; group: number };

export type ShortMembershipForm = Pick<
  MembershipForm,
  'summary' | 'description' | 'beginDate' | 'endDate'
>;
