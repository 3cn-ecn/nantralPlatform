import { MembershipForm } from '../types/membership.types';
import { MembershipFormDTO } from './membership.dto';

export function convertMembershipForm(form: MembershipForm): MembershipFormDTO {
  return {
    begin_date: form.beginDate.toISOString().split('T')[0] || '',
    end_date: form.endDate.toISOString().split('T')[0] || '',
    description: form.description,
    group: form.group,
    student: form.student,
    summary: form.summary,
    admin: form.admin,
  };
}
