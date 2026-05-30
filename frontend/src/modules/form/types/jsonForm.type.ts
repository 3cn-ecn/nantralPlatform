import { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface JsonFormSchema {
  uuid: string;
  name: string;
  description: string;
  schema: JsonSchema;
  uiSchema: UISchemaElement;
  i18nKeys_en: object;
  i18nKeys_fr: object;
}

export interface JsonFormAnswer {
  uuid: string;
  formSchemaUuid: string;
  data: object;
  submittedAt: Date;
  modifiedAt: Date;
  user: number;
}
