/* eslint-disable no-irregular-whitespace */
import { SignatureInfo } from '../signature.type';

function formatYear(year: number) {
  return year === 1 ? '1re' : `${year}e`;
}

function formatAcademicGroup(data: SignatureInfo) {
  if (data.year === 1) {
    return 'Groupe X';
  }
  if (!data.academic_group) {
    return 'Option X';
  }
  return data.academic_group.name;
}

function formatClubMemberships(data: SignatureInfo) {
  // filter out memberships without summary
  const memberships = data.club_memberships.filter((m) => m.summary);

  if (memberships.length === 0) {
    return '';
  }

  const membershipTextList = memberships.map(
    (m) => `${m.summary} - ${m.group.shortName}`,
  );
  return membershipTextList.join('\n') + '\n----';
}

export function formatSignatureInfoToMarkdown(data: SignatureInfo): string {
  return `# ${data.name}
*Élève-Ingénieur⋅e en ${formatYear(data.year)} année*
${formatAcademicGroup(data)}
----
${formatClubMemberships(data)}
Tel : +33 X XX XX XX XX
**${data.email}**`;
}
