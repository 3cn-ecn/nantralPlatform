import { MembershipForm, ShortMembershipForm } from '../types/membership.types';
import { MembershipFormDTO, ShortMembershipFormDTO } from './membership.dto';

export function convertMembershipForm(form: MembershipForm): MembershipFormDTO {
  return {
    begin_date: form.beginDate.toISOString().split('T')[0] || '',
    end_date: form.endDate.toISOString().split('T')[0] || '',
    description: form.description,
    group: form.group,
    user: form.user,
    summary: form.summary,
    admin: form.admin,
  };
}

export function convertShortMembershipForm(
  form: ShortMembershipForm,
): ShortMembershipFormDTO {
  return {
    summary: form.summary,
    description: form.description,
    begin_date: form.beginDate.toISOString().split('T')[0] || '',
    end_date: form.endDate.toISOString().split('T')[0] || '',
  };
}
