import { JsonSchema, UISchemaElement } from '@jsonforms/core';

import { BaseLanguage } from '#shared/i18n/config';

export interface JsonFormSchema {
  uuid: string;
  name: string;
  description: string;
  schema: JsonSchema;
  uiSchema: UISchemaElement;
  i18nKeys: Record<BaseLanguage, Record<string, object>>;
}

export interface JsonFormAnswer {
  uuid: string;
  formSchemaUuid: string;
  data: object;
  submittedAt: Date;
  modifiedAt: Date;
  user: number;
}
