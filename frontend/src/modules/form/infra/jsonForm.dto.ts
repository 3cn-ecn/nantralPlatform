import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface JsonFormSchemaDTO {
  uuid: string;
  name: string;
  description: string;
  schema: JsonSchema;
  ui_schema: UISchemaElement;
  // translation
  i18n_keys_en: object;
  i18n_keys_fr: object;
}

export interface JsonFormAnswerDTO {
  uuid: string;
  form_schema: string;
  data: object;
  submitted_at: string;
  modified_at: string;
  user: number;
}
