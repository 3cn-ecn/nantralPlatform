/* eslint-disable no-irregular-whitespace */
import { SignatureInfo } from '../signature.type';

function formatYear(year: number) {
  return year === 1 ? '1re' : `${year}e`;
}

function formatAcademicGroup(data: SignatureInfo) {
  if (data.year === 1) {
    return 'Groupe X';
  }
  if (data.academicGroups.length === 0) {
    return 'Option X';
  }
  return data.academicGroups.map((g) => g.name).join('\n');
}

function formatClubMemberships(data: SignatureInfo) {
  // filter out memberships without summary
  const memberships = data.clubMemberships.filter((m) => m.summary);

  if (memberships.length === 0) {
    return '';
  }

  return memberships
    .map((m) => `${m.summary} - ${m.group.shortName}`)
    .join('\n');
}

function nbLines(text: string) {
  if (!text) {
    return 0;
  }

  return text.split('\n').length;
}

export function formatSignatureInfoToMarkdown(data: SignatureInfo): string {
  const header = [
    `# ${data.name}`,
    `*Élève-Ingénieur⋅e en ${formatYear(data.year)} année*`,
  ].join('\n');
  const academicInfos = formatAcademicGroup(data);
  const clubsInfos = formatClubMemberships(data);
  const footer = ['Tel : +33 X XX XX XX XX', `**${data.email}**`].join('\n');

  if (nbLines(academicInfos) > 1 && nbLines(clubsInfos) == 0) {
    return [header, '---', academicInfos, '---', footer].join('\n');
  }
  if (nbLines(clubsInfos) === 0) {
    return [header, academicInfos, '---', footer].join('\n');
  }
  return [header, academicInfos, '---', clubsInfos, '---', footer].join('\n');
}
