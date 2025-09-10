import { Membership } from '#modules/group/types/membership.types';

import { RoommatesMembershipDTO } from './roommates.dto';

// temporary function to convert housing membership to Membership
export function adaptRoommatesMembership(
  obj: RoommatesMembershipDTO,
): Membership {
  return {
    id: obj.id,
    beginDate: new Date(obj.group.begin_date),
    endDate: new Date(obj.group.end_date),
    admin: false,
    adminRequest: '',
    summary: obj.nickname,
    student: { id: -1, name: '', picture: '', url: '' },
    priority: 0,
    description: '',
    group: {
      category: '',
      id: -1,
      name: obj.group.name,
      shortName: obj.group.name,
      slug: obj.group.name,
      url: obj.group.url,
    },
  };
}
