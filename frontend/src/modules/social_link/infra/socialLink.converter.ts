import { SocialLinkForm } from '../types/socialLink.type';
import { SocialLinkFormDTO } from './socialLink.dto';

export function convertSocialLinkForm(form: SocialLinkForm): SocialLinkFormDTO {
  return form;
}
