import { SocialLink, SocialLinkForm } from '../types/socialLink.type';

export function convertToSocialLinkForm(
  socialLink: SocialLink,
): SocialLinkForm {
  return {
    label: socialLink.label,
    uri: socialLink.uri,
    id: socialLink.id,
  };
}

export function useSocialLinksFormValues(socialLinks: SocialLink[]) {
  return socialLinks.map((socialLink) => convertToSocialLinkForm(socialLink));
}
