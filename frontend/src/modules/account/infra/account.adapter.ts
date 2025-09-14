import { RegisterCreated, RegisterForm, Username } from '../account.type';
import { RegisterCreatedDTO, RegisterDTO, UsernameDTO } from './account.dto';

export function adaptRegisterForm(form: RegisterForm): RegisterDTO {
  return {
    email: form.email,
    username: form.username,
    faculty: form.faculty,
    first_name: form.firstName,
    last_name: form.lastName,
    password: form.password,
    path: form?.path,
    promo: form.promo,
    invitation_uuid: form?.invitationUUID,
  };
}

export function adaptRegisterCreatedDTO(
  data: RegisterCreatedDTO,
): RegisterCreated {
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    username: data.username,
    faculty: data.faculty,
    path: data.path,
    promo: data.promo,
  };
}

export function adaptUsername(data: UsernameDTO): Username {
  return {
    username: data.username,
    name: data.name,
    picture: data.picture,
    hasUpdatedUsername: data.has_updated_username,
    hasOpenedMatrix: data.has_opened_matrix,
  };
}
