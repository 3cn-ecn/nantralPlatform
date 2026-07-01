import { Email } from '#modules/account/email.type';
import { EmailDTO } from '#modules/account/infra/email.dto';

export function adaptEmail(emailDto: EmailDTO): Email {
  return {
    uuid: emailDto.uuid,
    email: emailDto.email,
    isValid: emailDto.is_valid,
    isAuthorizedOrganisationEmail: emailDto.is_authorized_organisation_email,
    authorizedOrganisation: emailDto.authorized_organisation,
    isMain: emailDto.is_main,
    isVisible: emailDto.is_visible,
  };
}
