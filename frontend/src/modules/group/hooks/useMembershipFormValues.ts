import { Membership, MembershipForm } from '../types/membership.types';

export function convertMembershipToForm(
  membership: Membership,
): MembershipForm {
  return {
    beginDate: membership.beginDate,
    endDate: membership.endDate,
    description: membership.description,
    summary: membership.summary,
    group: membership.group.id,
    user: membership.user.id,
    admin: membership.admin,
  };
}
