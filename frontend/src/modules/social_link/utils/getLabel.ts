import { SocialLink } from '../types/socialLink.type';
import { getDomain } from './getDomain';

export function getLabel(socialLink: Pick<SocialLink, 'uri' | 'label'>) {
  return (
    socialLink.label ||
    getDomain(socialLink) ||
    new URL(socialLink.uri).pathname
  );
}
