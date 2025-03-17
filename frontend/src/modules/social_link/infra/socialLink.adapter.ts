import { SocialLink, SocialLinkForm } from '../types/socialLink.type';
import { SocialLinkDTO, SocialLinkFormDTO } from './socialLink.dto';

export function adaptSocialLink(socialLink: SocialLinkDTO): SocialLink {
  return {
    id: socialLink.id,
    label: socialLink.label,
    uri: socialLink.uri,
  };
}

export function adaptSocialLinkForm(form: SocialLinkFormDTO): SocialLinkForm {
  return form;
}
