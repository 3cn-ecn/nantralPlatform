import { SocialLink } from '../types/socialLink.type';
import { getDomain } from './getDomain';

export function getLabel(socialLink: SocialLink) {
  return (
    socialLink.label ||
    getDomain(socialLink) ||
    new URL(socialLink.uri).pathname
  );
}
