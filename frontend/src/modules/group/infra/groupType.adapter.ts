import { GroupTypePreview } from '../types/groupType.types';
import { GroupTypePreviewDTO } from './groupType.dto';

export function adaptGroupTypePreview(
  groupType: GroupTypePreviewDTO,
): GroupTypePreview {
  return {
    name: groupType.name,
    slug: groupType.slug,
    noMembershipDates: groupType.no_membership_dates,
  };
}
