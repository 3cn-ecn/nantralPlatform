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
    academic_group: signatureInfoDto.academic_group
      ? adaptGroupPreview(signatureInfoDto.academic_group)
      : undefined,
    club_memberships: signatureInfoDto.club_memberships.map((membership) =>
      adaptMembership(membership),
    ),
  };
}
