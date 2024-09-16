import { SocialLink } from '../types/socialLink.type';

export function getDomain(socialLink: SocialLink) {
  const parsedUrl = new URL(socialLink.uri);
  return parsedUrl.hostname.split('.').slice(-2).join('.');
}
