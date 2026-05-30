import { FC } from 'react';

import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { UUID } from 'crypto';

export interface InputTypeElementProps {
  label?: string;
  helperText?: string;
  nodeId?: UUID;
  required?: boolean;
  fullWidth?: boolean;
  margin?: 'normal' | 'dense' | 'none';
  schema?: JsonSchema;
  error?: boolean;
  size?: 'small' | 'medium';
  [key: string]: unknown;
}

export interface InputType {
  title: string;
  element: FC<InputTypeElementProps>;
  defaultSchema: JsonSchema;
  additionalInputs?: FC<{ nodeId: UUID; [key: string]: unknown }>;
}

export interface ElementType {
  title: string;
  element: FC<{ nodeId: UUID; allowedLayoutTypes?: string[] }>;
  defaultUiSchema: UISchemaElement;
}

export interface AdditionalInputProps {
  nodeId: UUID;
}

export interface LayoutNode {
  id: UUID;
  parentId?: UUID;
  type: string;
}

export interface BaseLayout extends LayoutNode {
  id: UUID;
  parentId?: UUID;
}

export interface ContainerNode extends BaseLayout {
  type: 'VerticalLayout' | 'HorizontalLayout' | 'Categorization';
  elements: UUID[];
}

export interface GroupNode extends BaseLayout {
  type: 'Group';
  elements: UUID[];
  label?: string;
}

export interface CategoryNode extends BaseLayout {
  type: 'Category';
  elements: UUID[];
  label: string;
}

export interface ControlNode extends BaseLayout {
  type: 'Control';
  inputType?: string;
  schema?: JsonSchema;
}

export interface LabelNode extends BaseLayout {
  type: 'Label';
  text: string;
}

export type AnyLayoutNode =
  | ContainerNode
  | GroupNode
  | CategoryNode
  | ControlNode
  | LabelNode;
