import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { UUID } from 'crypto';

import { BaseLanguage } from '#shared/i18n/config';

export interface UserRole {
  id: number;
  user: number;
  formSchema: UUID;
  role: 'owner' | 'editor' | 'answer_viewer' | 'form_viewer';
}

export interface JsonFormSchema {
  uuid: UUID;
  name: string;
  description: string;
  schema: JsonSchema;
  uiSchema: UISchemaElement;
  i18nKeys: Record<BaseLanguage, Record<string, object>>;
  isAdmin: boolean;
  canViewAnswers: boolean;
  canViewForm: boolean;
  active: boolean;
  editable: boolean;
  public: boolean;
}

export interface JsonFormAnswer {
  uuid: UUID;
  formSchemaUuid: string;
  data: object;
  submittedAt: Date;
  modifiedAt: Date;
  user: number;
}

export type JsonFormPreview = Pick<
  JsonFormSchema,
  | 'uuid'
  | 'name'
  | 'description'
  | 'isAdmin'
  | 'canViewAnswers'
  | 'canViewForm'
  | 'active'
  | 'editable'
  | 'public'
> & { roles?: UserRole[] };

export type JsonFormSchemaForm = Omit<
  JsonFormSchema,
  | 'isAdmin'
  | 'canViewAnswers'
  | 'canViewForm'
  | 'active'
  | 'editable'
  | 'public'
>;
