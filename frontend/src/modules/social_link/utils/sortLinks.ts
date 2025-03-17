import { SocialLink } from '../types/socialLink.type';
import { getLabel } from './getLabel';

export function sortLinks(links: SocialLink[]): SocialLink[] {
  return links.sort((a, b) => {
    const protocolA = new URL(a.uri).protocol;
    const protocolB = new URL(b.uri).protocol;
    const labelA = getLabel(a);
    const labelB = getLabel(b);
    // sort by protocol first, then by label
    return -protocolA.localeCompare(protocolB) || labelA.localeCompare(labelB);
  });
}
