import { Membership } from '#modules/group/types/membership.types';

import { SignatureInfo } from '../../signature.type';
import { TemplateType } from './SelectTemplate';

function formatYear(year: number, lang: 'fr' | 'en') {
  if (lang === 'fr') {
    return year === 1 ? '1re' : `${year}e`;
  }
  if (year === 1) return '1st';
  if (year === 2) return '2nd';
  if (year === 3) return '3rd';
  return `${year}th`;
}

function formatHeader(data: SignatureInfo, lang: 'fr' | 'en') {
  const formattedYear = formatYear(data.year, lang);
  const status =
    lang === 'fr'
      ? `*Élève-Ingénieur⋅e en ${formattedYear} année*`
      : `*Engineer student in ${formattedYear} year*`;

  return [`# ${data.name}`, status].join('\n');
}

function formatAcademicGroup(data: SignatureInfo, lang: 'fr' | 'en') {
  if (data.year === 1) {
    return lang === 'fr' ? 'Groupe X' : 'Group X';
  }
  if (data.academicGroups.length === 0) {
    return 'Option X';
  }
  return data.academicGroups.map((g) => g.name).join('\n');
}

function formatClubMemberships(clubMemberships: Membership[]) {
  return clubMemberships
    .filter((m) => m.summary)
    .map((m) => `${m.summary} - ${m.group.shortName}`)
    .join('\n');
}

function formatPhoneNumber(lang: 'fr' | 'en' = 'fr') {
  return lang === 'fr' ? 'Tel : +33 X XX XX XX XX' : 'Phone: +33 X XX XX XX XX';
}

function nbLines(text: string) {
  if (!text) {
    return 0;
  }

  return text.split('\n').length;
}

function formatEcnTemplate(data: SignatureInfo, lang: 'fr' | 'en' = 'fr') {
  const header = formatHeader(data, lang);
  const academicInfos = formatAcademicGroup(data, lang);
  const clubsInfos = formatClubMemberships(data.clubMemberships);
  const footer = [formatPhoneNumber(lang), `**${data.email}**`].join('\n');

  if (nbLines(academicInfos) > 1 && nbLines(clubsInfos) == 0) {
    return [header, '---', academicInfos, '---', footer].join('\n');
  }
  if (nbLines(clubsInfos) === 0) {
    return [header, academicInfos, '---', footer].join('\n');
  }

  return [header, academicInfos, '---', clubsInfos, '---', footer].join('\n');
}

function formatClubTemplate(data: SignatureInfo, clubSlug: string) {
  const clubMembership = data.clubMemberships.find(
    (m) => m.group.slug === clubSlug.slice(1),
  );
  if (!clubMembership) {
    return '';
  }

  return [
    `# ${data.name}`,
    `*${clubMembership.summary}*`,
    clubMembership.group.name,
    '---',
    formatPhoneNumber(),
    `**${data.email}**`,
  ].join('\n');
}

export function formatSignatureInfoToMarkdown(
  data: SignatureInfo,
  template: TemplateType,
) {
  if (template === 'ecn') {
    return formatEcnTemplate(data, 'fr');
  }
  if (template === 'international') {
    return formatEcnTemplate(data, 'en');
  }
  return formatClubTemplate(data, template);
}
