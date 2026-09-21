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
  is_admin: boolean;
  can_view_answers: boolean;
  can_view_form: boolean;
  active: boolean;
  editable: boolean;
  public: boolean;
}

export interface JsonFormAnswerDTO {
  uuid: string;
  form_schema: string;
  data: object;
  submitted_at: string;
  modified_at: string;
  user: number;
}

export type JsonFormAnswerPreviewDTO = Pick<
  JsonFormAnswerDTO,
  'uuid' | 'modified_at' | 'user'
>;

export type JsonFormPreviewDTO = Pick<
  JsonFormSchemaDTO,
  | 'uuid'
  | 'name'
  | 'description'
  | 'is_admin'
  | 'can_view_answers'
  | 'can_view_form'
  | 'active'
  | 'editable'
  | 'public'
> & {
  userrole_set: UserRoleDTO[];
};

export type JsonFormSchemaFormDTO = Omit<
  JsonFormSchemaDTO,
  | 'is_admin'
  | 'can_view_answers'
  | 'can_view_form'
  | 'active'
  | 'editable'
  | 'public'
>;
