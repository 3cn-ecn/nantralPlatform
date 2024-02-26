import { SocialLink, SocialLinkForm } from '../types/socialLink.type';
import { SocialLinkDTO, SocialLinkFormDTO } from './socialLink.dto';
import { adaptSocialNetwork } from './socialNetork.adapter';

export function adaptSocialLink(socialLink: SocialLinkDTO): SocialLink {
  return {
    id: socialLink.id,
    label: socialLink.label,
    network: adaptSocialNetwork(socialLink.network),
    uri: socialLink.uri,
  };
}

export function adaptSocialLinkForm(form: SocialLinkFormDTO): SocialLinkForm {
  return form;
}
