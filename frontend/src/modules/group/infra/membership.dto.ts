import { StudentPreviewDTO } from '#modules/student/infra/student.dto';

import { GroupPreviewDTO } from './group.dto';

export interface MembershipDTO {
  id: number;
  student: StudentPreviewDTO;
  group: GroupPreviewDTO;
  summary: string;
  description: string;
  begin_date: string;
  end_date: string;
  priority: number;
  admin: boolean;
  admin_request: string;
}

export type MembershipFormDTO = Pick<
  MembershipDTO,
  'begin_date' | 'end_date' | 'summary' | 'description' | 'admin'
> & { group: number; student: number };
