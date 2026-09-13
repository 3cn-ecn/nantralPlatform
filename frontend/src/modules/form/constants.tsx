import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import InputIcon from '@mui/icons-material/Input';
import NumbersIcon from '@mui/icons-material/Numbers';
import PinIcon from '@mui/icons-material/Pin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import TuneIcon from '@mui/icons-material/Tune';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import { Divider } from '@mui/material';

import { InputType, LayoutType } from '#modules/form/types/form.type';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
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
} from '#modules/form/view/renderers/MenuParams';
import { QuestionFields } from '#modules/form/view/shared/QuestionFields';

export const INPUT_TYPES: Record<string, InputType> = {
  text: {
    i18nKey: 'jsonForm.edit.control.text',
    icon: <TextFieldsIcon />,
    defaultSchema: { type: 'string' },
    getOptions: (id) => [
      <BooleanUiParm
        key={'multi'}
        id={id}
        title={'mulit'}
        i18nKey={'jsonForm.edit.option.multi.label'}
      />,
      <BooleanUiParm
        key={'trim'}
        id={id}
        title={'trim'}
        i18nKey={'jsonForm.edit.option.trim.label'}
      />,
      <BooleanUiParm
        key={'restrict'}
        id={id}
        title={'restrict'}
        i18nKey={'jsonForm.edit.option.restrict.label'}
        i18nKeyHelp={'jsonForm.edit.option.restrict.helperText'}
      />,
      <Divider key={'divider'} />,
      <NumberParam
        key={'maxLength'}
        id={id}
        title={'maxLength'}
        step={1}
        type={'numeric'}
        minimum={1}
        i18nKey={'jsonForm.edit.option.maxLength.label'}
        i18nKeyHelp={'jsonForm.edit.option.maxLength.helperText'}
      />,
      <NumberParam
        key={'minLength'}
        id={id}
        title={'minLength'}
        step={1}
        type={'numeric'}
        minimum={0}
        i18nKey={'jsonForm.edit.option.minLength.label'}
        i18nKeyHelp={'jsonForm.edit.option.minLength.helperText'}
      />,
      <Divider key={'divider2'} />,
      <StringParam
        key={'pattern'}
        id={id}
        title={'pattern'}
        i18nKey={'jsonForm.edit.option.pattern.label'}
        i18nKeyHelp={'jsonForm.edit.option.pattern.helperText'}
      />,
      <StringParam
        key={'format'}
        id={id}
        title={'format'}
        i18nKey={'jsonForm.edit.option.format.label'}
        i18nKeyHelp={'jsonForm.edit.option.format.helperText'}
      />,
    ],
  },
  number: {
    i18nKey: 'jsonForm.edit.control.number',
    icon: <NumbersIcon />,
    defaultSchema: { type: 'number' },
    getOptions: (id) => [
      <BooleanUiParm
        key={'trim'}
        id={id}
        title={'trim'}
        i18nKey={'jsonForm.edit.option.trim.label'}
      />,
      <BooleanUiParm
        key={'spinner'}
        id={id}
        title={'spinner'}
        i18nKey={'jsonForm.edit.option.spinner.label'}
        i18nKeyHelp={'jsonForm.edit.option.spinner.helperText'}
      />,
      <Divider key={'divider'} />,
      ...['multipleOf', 'minimum', 'maximum', 'default'].map((type) => (
        <NumberParam
          key={type}
          id={id}
          title={type}
          i18nKey={`jsonForm.edit.option.${type}.label`}
          i18nKeyHelp={`jsonForm.edit.option.${type}.helperText`}
        />
      )),
    ],
  },
  integer: {
    i18nKey: 'jsonForm.edit.control.integer',
    icon: <PinIcon />,
    defaultSchema: { type: 'integer' },
    getOptions: (id) => [
      <BooleanUiParm
        key={'trim'}
        id={id}
        title={'trim'}
        i18nKey={'jsonForm.edit.option.trim.label'}
      />,
      <BooleanUiParm
        key={'spinner'}
        id={id}
        title={'spinner'}
        i18nKey={'jsonForm.edit.option.spinner.label'}
      />,
      <Divider key={'divider'} />,
      ...['multipleOf', 'minimum', 'maximum', 'default'].map((type) => (
        <NumberParam
          key={type}
          id={id}
          title={type}
          step={1}
          i18nKey={`jsonForm.edit.option.${type}.label`}
          i18nKeyHelp={`jsonForm.edit.option.${type}.helperText`}
        />
      )),
    ],
  },
  date: {
    i18nKey: 'jsonForm.edit.control.date',
    icon: <CalendarTodayIcon />,
    defaultSchema: { type: 'string', format: 'date' },
    defaultOptions: { format: 'date' },
  },
  time: {
    i18nKey: 'jsonForm.edit.control.time',
    icon: <AccessTimeIcon />,
    defaultSchema: { type: 'string', format: 'time' },
    defaultOptions: { format: 'time' },
  },
  'date-time': {
    i18nKey: 'jsonForm.edit.control.dateTime',
    icon: <EventIcon />,
    defaultSchema: { type: 'string', format: 'date-time' },
    defaultOptions: { format: 'date-time' },
  },
  'Multiple choice': {
    i18nKey: 'jsonForm.edit.control.multipleChoice',
    icon: <CheckBoxIcon />,
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
    i18nKey: 'jsonForm.edit.control.enum',
    icon: <RadioButtonCheckedIcon />,
    defaultSchema: {
      type: 'string',
    },
    defaultOptions: {
      format: 'radio',
    },
    getOptions: (id) => [
      <BooleanUiParm
        key={'autocomplete'}
        id={id}
        title={'autocomplete'}
        i18nKey={'jsonForm.edit.option.autocomplete.label'}
      />,
      <BooleanUiParm
        key={'format'}
        id={id}
        title={'format'}
        i18nKey={'jsonForm.edit.option.enumFormat.label'}
      />,
    ],
    additionalInputs: MultipleChoiceAdditionalInput,
  },
  boolean: {
    i18nKey: 'jsonForm.edit.control.boolean',
    icon: <ToggleOnIcon />,
    defaultSchema: { type: 'boolean' },
    getOptions: (id) => [
      <BooleanUiParm
        key={'toggle'}
        id={id}
        title={'toggle'}
        i18nKey={'jsonForm.edit.option.toggle.label'}
      />,
    ],
  },
  weighedList: {
    i18nKey: 'jsonForm.edit.control.weightedList',
    icon: <TuneIcon />,
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
      options: { variant: 'stepper', showNavButtons: true },
    },
    i18nKey: 'jsonForm.edit.layout.categorization',
    icon: <AccountTreeIcon />,
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
    i18nKey: 'jsonForm.edit.layout.category',
    icon: <FolderIcon />,
  },
  VerticalLayout: {
    type: 'VerticalLayout',
    element: VerticalLayout,
    allowedChildren: [
      'Control',
      'Categorization',
      'HorizontalLayout',
      'Group',
      'Label',
    ],
    defaultPayload: { type: 'VerticalLayout' },
    i18nKey: 'jsonForm.edit.layout.vertical',
    icon: <ViewAgendaIcon />,
  },
  HorizontalLayout: {
    type: 'HorizontalLayout',
    element: HorizontalLayout,
    allowedChildren: [
      'Control',
      'Categorization',
      'VerticalLayout',
      'Group',
      'Label',
    ],
    defaultPayload: { type: 'HorizontalLayout' },
    i18nKey: 'jsonForm.edit.layout.horizontal',
    icon: <ViewWeekIcon />,
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
    i18nKey: 'jsonForm.edit.layout.group',
    icon: <GroupWorkIcon />,
  },
  Control: {
    type: 'Control',
    element: QuestionFields,
    allowedChildren: [],
    defaultPayload: {
      type: 'Control',
      schema: { type: 'string', 'x-type': 'text' },
    },
    i18nKey: 'jsonForm.edit.layout.control',
    icon: <InputIcon />,
  },
  Label: {
    type: 'Label',
    element: LabelLayout,
    allowedChildren: [],
    defaultPayload: {
      type: 'Label',
    },
    i18nKey: 'jsonForm.edit.layout.label',
    icon: <TextFieldsIcon />,
  },
};

export const getDefaultForm = (): JsonFormSchema => {
  return {
    uuid: crypto.randomUUID(),
    name: '',
    description: '',
    schema: {
      type: 'object',
      properties: {},
    },
    uiSchema: {
      type: 'VerticalLayout',
      elements: [],
      options: {},
    },
    i18nKeys: { fr: {}, en: {} },
    isAdmin: false,
    canViewAnswers: false,
    canViewForm: false,
    active: false,
    editable: true,
    public: false,
  };
};
