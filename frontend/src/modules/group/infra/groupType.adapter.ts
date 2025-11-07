import { GroupTypePreview } from '../types/groupType.types';
import { GroupTypePreviewDTO } from './groupType.dto';

export function adaptGroupTypePreview(
  groupType: GroupTypePreviewDTO,
): GroupTypePreview {
  return {
    name: groupType.name,
    slug: groupType.slug,
    isMap: groupType.is_map,
    noMembershipDates: groupType.no_membership_dates,
    canCreate: groupType.can_create,
    canHaveParent: groupType.can_have_parent,
  };
}
