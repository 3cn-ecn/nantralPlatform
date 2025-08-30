import { Email } from '#modules/account/email.type';
import { EmailDTO } from '#modules/account/infra/email.dto';

export function adaptEmail(emailDto: EmailDTO): Email {
  return {
    uuid: emailDto.uuid,
    email: emailDto.email,
    isValid: emailDto.is_valid,
    isECNEmail: emailDto.is_ecn_email,
    isMain: emailDto.is_main,
    isVisible: emailDto.is_visible,
  };
}
