import {
  JsonFormAnswerDTO,
  JsonFormSchemaDTO,
} from '#modules/form/infra/jsonForm.dto';
import {
  JsonFormAnswer,
  JsonFormSchema,
} from '#modules/form/types/jsonForm.type';

export const adaptJsonFormSchema = (
  schemaDTO: JsonFormSchemaDTO,
): JsonFormSchema => {
  return {
    uuid: schemaDTO.uuid,
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
    uuid: answerDTO.uuid,
    formSchemaUuid: answerDTO.form_schema,
    data: answerDTO.data,
    submittedAt: new Date(answerDTO.submitted_at),
    modifiedAt: new Date(answerDTO.modified_at),
    user: answerDTO.user,
  };
};
