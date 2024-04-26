import { MembershipForm } from '../types/membership.types';
import { MembershipFormDTO } from './membership.dto';

export function convertMembershipForm(form: MembershipForm): MembershipFormDTO {
  return {
    begin_date: form.beginDate.toISOString().slice(0, 10) || '',
    end_date: form.endDate.toISOString().slice(0, 10) || '',
    description: form.description,
    group: form.group,
    student: form.student,
    summary: form.summary,
    admin: form.admin,
  };
}
