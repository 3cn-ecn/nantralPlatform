import { adaptStudentPreview } from '#modules/student/infra/student.adapter';

import { Membership } from '../types/membership.types';
import { adaptGroupPreview } from './group.adapter';
import { MembershipDTO } from './membership.dto';

export function adaptMembership(membershipDTO: MembershipDTO): Membership {
  return {
    id: membershipDTO.id,
    student: adaptStudentPreview(membershipDTO.user),
    group: adaptGroupPreview(membershipDTO.group),
    summary: membershipDTO.summary,
    description: membershipDTO.description,
    beginDate: new Date(membershipDTO.begin_date),
    endDate: new Date(membershipDTO.end_date),
    priority: membershipDTO.priority,
    admin: membershipDTO.admin,
    adminRequest: membershipDTO.admin_request,
  };
}
