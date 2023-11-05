import { adaptGroupPreview } from '#modules/group/infra/group.adapter';
import { adaptMembership } from '#modules/group/infra/membership.adapter';

import { SignatureInfo } from '../signature.type';
import { SignatureInfoDTO } from './signature.dto';

export function adaptSignatureInfo(
  signatureInfoDto: SignatureInfoDTO,
): SignatureInfo {
  return {
    name: signatureInfoDto.name,
    year: signatureInfoDto.year,
    email: signatureInfoDto.email,
    academicGroups: signatureInfoDto.academic_groups.map((group) =>
      adaptGroupPreview(group),
    ),
    clubMemberships: signatureInfoDto.club_memberships.map((membership) =>
      adaptMembership(membership),
    ),
  };
}
