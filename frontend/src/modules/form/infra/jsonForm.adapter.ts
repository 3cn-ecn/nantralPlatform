import { UUID } from 'crypto';

import {
  JsonFormAnswerDTO,
  JsonFormPreviewDTO,
  JsonFormSchemaDTO,
  UserRoleDTO,
} from '#modules/form/infra/jsonForm.dto';
import {
  JsonFormAnswer,
  JsonFormPreview,
  JsonFormSchema,
  UserRole,
} from '#modules/form/types/jsonForm.type';

export const adaptUserRole = (userRoleDto: UserRoleDTO): UserRole => {
  return {
    id: userRoleDto.id,
    user: userRoleDto.user,
    formSchema: userRoleDto.form_schema as UUID,
    role: userRoleDto.role as UserRole['role'],
  };
};

export const adaptJsonFormSchema = (
  schemaDTO: JsonFormSchemaDTO,
): JsonFormSchema => {
  return {
    uuid: schemaDTO.uuid as UUID,
    name: schemaDTO.name,
    description: schemaDTO.description,
    schema: schemaDTO.schema,
    uiSchema: schemaDTO.ui_schema,
    i18nKeys: { en: schemaDTO.i18n_keys_en, fr: schemaDTO.i18n_keys_fr },
  };
};

export const adaptJsonFormAnswer = (
  answerDTO: JsonFormAnswerDTO,
): JsonFormAnswer => {
  return {
    uuid: answerDTO.uuid as UUID,
    formSchemaUuid: answerDTO.form_schema,
    data: answerDTO.data,
    submittedAt: new Date(answerDTO.submitted_at),
    modifiedAt: new Date(answerDTO.modified_at),
    user: answerDTO.user,
  };
};

export const adaptJsonFormPreview = (
  jsonFormPreviewDto: JsonFormPreviewDTO,
): JsonFormPreview => {
  return {
    uuid: jsonFormPreviewDto.uuid as UUID,
    name: jsonFormPreviewDto.name,
    description: jsonFormPreviewDto.description,
    roles: jsonFormPreviewDto.userrole_set.map(adaptUserRole),
  };
};
