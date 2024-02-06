import { RegisterForm } from '../account.type';
import { RegisterDTO } from './account.dto';

export function adaptRegisterForm(form: RegisterForm): RegisterDTO {
  return {
    email: form.email,
    faculty: form.faculty.value,
    first_name: form.firstName,
    last_name: form.lastName,
    password: form.password,
    path: form?.path?.value,
    promo: form.promo,
    invitation_uuid: form?.invitationUUID,
  };
}
