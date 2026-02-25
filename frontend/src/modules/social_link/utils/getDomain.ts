import { SocialLink } from '../types/socialLink.type';

export function getDomain(socialLink: Pick<SocialLink, 'uri'>) {
  const parsedUrl = new URL(socialLink.uri);
  return parsedUrl.hostname.split('.').slice(-2).join('.');
}
