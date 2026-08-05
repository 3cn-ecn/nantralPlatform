import { Divider } from '@mui/material';

import { InputType, LayoutType } from '#modules/form/types/form.type';
import { MultipleChoiceAdditionalInput } from '#modules/form/view/MultipleChoiceAdditionalInput/MultipleChoiceAdditionalInput';
import { WeightedAdditionalInput } from '#modules/form/view/WeightedAdditionalInput/WeightedAdditionalInput';
import { CategorizationLayout } from '#modules/form/view/layouts/CategorizationLayout';
import { CategoryLayout } from '#modules/form/view/layouts/CategoryLayout';
import { GroupLayout } from '#modules/form/view/layouts/GroupLayout';
import { HorizontalLayout } from '#modules/form/view/layouts/HorizontalLayout';
import { LabelLayout } from '#modules/form/view/layouts/LabelLayout';
import { VerticalLayout } from '#modules/form/view/layouts/VerticalLayout';
import {
  BooleanUiParm,
  NumberParam,
  StringParam,
  StringUiParam,
} from '#modules/form/view/renderers/MenuParams';
import { QuestionFields } from '#modules/form/view/shared/QuestionFields';

export const INPUT_TYPES: Record<string, InputType> = {
  text: {
    defaultSchema: { type: 'string' },
    getOptions: (id) => [
      ...['multi', 'trim', 'restrict'].map((type) => (
        <BooleanUiParm key={type} id={id} title={type} />
      )),
      <Divider key={'divider'} />,
      <NumberParam
        key={'maxLength'}
        id={id}
        title={'maxLength'}
        step={1}
        type={'numeric'}
        minimum={1}
      />,
      <NumberParam
        key={'minLength'}
        id={id}
        title={'minLength'}
        step={1}
        type={'numeric'}
        minimum={0}
      />,
      <Divider key={'divider2'} />,
      <StringParam key={'pattern'} id={id} title={'pattern'} />,
      <StringUiParam key={'format'} id={id} title={'format'} />,
    ],
  },
  number: {
    defaultSchema: { type: 'number' },
    getOptions: (id) => [
      <BooleanUiParm key={'trim'} id={id} title={'trim'} />,
      <BooleanUiParm key={'slider'} id={id} title={'slider'} />,
      <BooleanUiParm key={'spinner'} id={id} title={'spinner'} />,
      <Divider key={'divider'} />,
      ...['multipleOf', 'minimum', 'maximum', 'default'].map((type) => (
        <NumberParam key={type} id={id} title={type} />
      )),
    ],
  },
  integer: {
    defaultSchema: { type: 'integer' },
    getOptions: (id) => [
      <BooleanUiParm key={'trim'} id={id} title={'trim'} />,
      <BooleanUiParm key={'slider'} id={id} title={'slider'} />,
      <BooleanUiParm key={'spinner'} id={id} title={'spinner'} />,
      <Divider key={'divider'} />,
      ...['multipleOf', 'minimum', 'maximum', 'default'].map((type) => (
        <NumberParam key={type} id={id} title={type} step={1} />
      )),
    ],
  },
  date: {
    defaultSchema: { type: 'string', format: 'date' },
  },
  time: {
    defaultSchema: { type: 'string', format: 'time' },
  },
  'date-time': {
    defaultSchema: { type: 'string', format: 'date-time' },
  },
  'Multiple choice': {
    defaultSchema: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    additionalInputs: (props) => (
      <MultipleChoiceAdditionalInput {...props} multiple />
    ),
  },
  Enum: {
    defaultSchema: {
      type: 'string',
    },
    getOptions: (id) => [
      <BooleanUiParm key={'autocomplete'} id={id} title={'autocomplete'} />,
    ],
    additionalInputs: MultipleChoiceAdditionalInput,
  },
  boolean: {
    defaultSchema: { type: 'boolean' },
    getOptions: (id) => [
      <BooleanUiParm key={'toggle'} id={id} title={'toggle'} />,
    ],
  },
  weighedList: {
    defaultOptions: { table: true },
    defaultSchema: {
      allOf: [
        {
          type: 'object',
          properties: {
            // this is dynamic
          },
        },
        {
          patternProperties: {
            '^.*$': {
              type: 'object',
              properties: {
                weight: { type: 'integer', minimum: 0, maximum: 3, default: 0 },
                value: {
                  type: 'integer',
                  oneOf: [
                    // this is dynamic
                  ],
                },
              },
              required: ['value', 'weight'],
            },
          },
        },
      ],
    },
    additionalInputs: WeightedAdditionalInput,
  },
};

export const LAYOUT_TYPES: Record<string, LayoutType> = {
  Categorization: {
    type: 'Categorization',
    element: CategorizationLayout,
    allowedChildren: ['Category'],
    defaultPayload: {
      type: 'Categorization',
      options: {
        showNavButton: true,
      },
    },
  },
  Category: {
    type: 'Category',
    element: CategoryLayout,
    allowedChildren: [
      'Control',
      'Categorization',
      'HorizontalLayout',
      'Group',
      'Label',
    ],
    defaultPayload: {
      type: 'Category',
    },
  },
  VerticalLayout: {
    type: 'VerticalLayout',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    element: VerticalLayout,
    allowedChildren: [
      'Control',
      'Categorization',
      'HorizontalLayout',
      'Group',
      'Label',
    ],
    defaultPayload: { type: 'VerticalLayout' },
  },
  HorizontalLayout: {
    type: 'HorizontalLayout',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    element: HorizontalLayout,
    allowedChildren: [
      'Control',
      'Categorization',
      'VerticalLayout',
      'Group',
      'Label',
    ],
    defaultPayload: { type: 'HorizontalLayout' },
  },
  Group: {
    type: 'Group',
    element: GroupLayout,
    allowedChildren: [
      'Control',
      'Categorization',
      'HorizontalLayout',
      'Group',
      'Label',
    ],
    defaultPayload: {
      type: 'Group',
    },
  },
  Control: {
    type: 'Control',
    element: QuestionFields,
    allowedChildren: [],
    defaultPayload: {
      type: 'Control',
      schema: { type: 'string', 'x-type': 'text' },
    },
  },
  Label: {
    type: 'Label',
    element: LabelLayout,
    allowedChildren: [],
    defaultPayload: {
      type: 'Label',
    },
  },
};
