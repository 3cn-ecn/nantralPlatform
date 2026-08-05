import { FC, ReactNode } from 'react';

import { JsonSchema, JsonSchema7, UISchemaElement } from '@jsonforms/core';
import { UUID } from 'crypto';

import { BaseLanguage } from '#shared/i18n/config';

export interface Payload {
  translation: Record<
    BaseLanguage,
    {
      label?: string;
      description?: string;
    } & Record<
      string,
      | string
      | {
          label?: string;
          description?: string;
        }
    >
  >;
  type: string;
  options: UISchemaElement['options'];
  schema: JsonSchema & { 'x-type'?: string };
  required?: boolean;
}

export interface Node {
  parent?: UUID;
  children: UUID[];
  payload: Payload;
}

export interface FormState {
  root: UUID;
  nodes: Record<UUID, Node>;
}

export interface InputType {
  getOptions?: (id: UUID) => ReactNode[]; /// MenuItems used as options
  defaultOptions?: UISchemaElement['options'];
  defaultSchema?: JsonSchema7;
  additionalInputs?: FC<{ nodeId: UUID; [key: string]: unknown }>; /// other inputs to be rendered with the component
}

export interface LayoutType {
  type: string;
  element: FC<{ children: ReactNode; nodeId: UUID; canAccept?: boolean }>;
  allowedChildren: string[];
  defaultPayload: Partial<Payload>;
}
