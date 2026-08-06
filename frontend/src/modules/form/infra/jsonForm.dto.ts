import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface UserRoleDTO {
  id: number;
  user: number;
  form_schema: string;
  role: string;
}

export interface JsonFormSchemaDTO {
  uuid: string;
  name: string;
  description: string;
  schema: JsonSchema;
  ui_schema: UISchemaElement;
  // translation
  i18n_keys_en: Record<string, object>;
  i18n_keys_fr: Record<string, object>;
}

export interface JsonFormAnswerDTO {
  uuid: string;
  form_schema: string;
  data: object;
  submitted_at: string;
  modified_at: string;
  user: number;
}

export type JsonFormPreviewDTO = Pick<
  JsonFormSchemaDTO,
  'uuid' | 'name' | 'description'
> & {
  userrole_set: UserRoleDTO[];
};
