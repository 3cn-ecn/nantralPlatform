import { GroupPreview } from '#modules/group/group.type';
import { Membership } from '#modules/group/types/membership.types';

export interface SignatureInfo {
  name: string;
  year: number;
  email: string;
  academic_group?: GroupPreview;
  club_memberships: Membership[];
}
