import { GroupPreviewDTO } from '#modules/group/infra/group.dto';
import { MembershipDTO } from '#modules/group/infra/membership.dto';

export interface SignatureInfoDTO {
  name: string;
  year: number;
  email: string;
  academic_groups: GroupPreviewDTO[];
  club_memberships: MembershipDTO[];
}
