import { GroupPreview } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';

export interface SignatureInfo {
  name: string;
  year: number;
  email: string;
  academicGroups: GroupPreview[];
  clubMemberships: Membership[];
}
