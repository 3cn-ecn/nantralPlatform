import { useCallback, useMemo } from 'react';

import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Delete as DeleteIcon,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField as MuiTextField,
} from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import { UUID } from 'crypto';
import { clone } from 'lodash';

import NumberField from '#modules/form/components/fields/NumberField';
import SpinnerField from '#modules/form/components/fields/SpinnerField';
import { useJsonForm } from '#modules/form/hooks/useJsonForm';
import {
  ControlNode,
  InputType,
  InputTypeElementProps,
} from '#modules/form/types/form.type';
import { FlexAuto, FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { DateField, DateTimeField } from '#shared/components/FormFields';
import { TextField } from '#shared/components/FormFields/TextField';
import { TimeField } from '#shared/components/FormFields/TimeField';
import { useToast } from '#shared/context/Toast.context';

// =========================
// COMPONENTS
// =========================

const MultipleChoiceInput = ({
  label,
  helperText,
  nodeId,
}: {
  label: string;
  helperText: string;
  nodeId: UUID;
}) => {
  const { jsonForm } = useJsonForm();
  const node = jsonForm.nodes[nodeId] as ControlNode;
  return (
    <FormControl>
      <FormLabel id={`label-${nodeId}`}>{label}</FormLabel>
      <FormGroup aria-labelledby={`label-${nodeId}`}>
        {(node.schema?.enum as string[])?.map((option: string) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Checkbox />}
            label={option}
          />
        ))}
      </FormGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

const ChoiceInput = ({
  label,
  helperText,
  nodeId,
}: {
  label: string;
  helperText: string;
  nodeId: UUID;
}) => {
  const { jsonForm } = useJsonForm();
  const node = jsonForm.nodes[nodeId] as ControlNode;
  return (
    <FormControl>
      <FormLabel id={`label-${nodeId}`}>{label}</FormLabel>
      <RadioGroup aria-labelledby={`label-${nodeId}`}>
        {(node.schema?.enum as string[])?.map((option: string) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

// =========================
// OPTIONS REDUCER
// =========================

type OptionsActionType =
  | {
      type: 'update';
      id: number;
      value: string;
    }
  | {
      type: 'add';
    }
  | {
      type: 'remove';
      id: number;
    };

const optionsReducer = (
  state: { id: number; value: string }[],
  action: OptionsActionType,
) => {
  switch (action.type) {
    case 'update':
      return state.map((option) =>
        option.id === action.id ? { ...option, value: action.value } : option,
      );
    case 'add':
      return [
        ...state,
        { id: state.length, value: `Option ${state.length + 1}` },
      ];
    case 'remove':
      return state
        .filter((option) => option.id !== action.id)
        .map((option, i) => ({ ...option, id: i }));
    default:
      return state;
  }
};

// =========================
// ADDITIONAL INPUT COMPONENT
// =========================

const MultipleChoiceAdditionalInput = ({
  nodeId,
  multiple = false,
}: {
  nodeId: UUID;
  multiple?: boolean;
}) => {
  const { jsonForm, updateNode } = useJsonForm();
  const node = jsonForm.nodes[nodeId] as ControlNode;
  const showToast = useToast();

  const options = useMemo(
    () =>
      ((node.schema?.enum as string[]) || []).map((option, i) => ({
        id: i,
        value: option,
      })),
    [node.schema?.enum],
  );

  const dispatch = useCallback(
    (action: OptionsActionType) => {
      const newOptions = optionsReducer(options, action);
      updateNode(nodeId, {
        schema: { ...node.schema, enum: newOptions.map((o) => o.value) },
      });
    },
    [node.schema, nodeId, options, updateNode],
  );

  const handleChange = useCallback(
    (val: string, i: number) => {
      dispatch({
        type: 'update',
        id: i,
        value: val,
      });
    },
    [dispatch],
  );

  const handleAddOption = useCallback(() => {
    dispatch({ type: 'add' });
  }, [dispatch]);

  const handleRemove = useCallback(
    (i: number) => {
      if (options.length <= 1) {
        showToast({
          message: 'At least 1 option is required',
          variant: 'error',
        });
        return;
      }
      dispatch({ type: 'remove', id: i });
    },
    [dispatch, options.length, showToast],
  );

  return (
    <FlexCol gap={2} my={2}>
      {options.map((option) => (
        <FlexRow gap={2} key={option.id} alignItems={'center'}>
          {multiple ? <CheckBoxOutlineBlankIcon /> : <RadioButtonUnchecked />}
          <TextField
            handleChange={(val) => handleChange(val, option.id)}
            value={option.value}
            size={'small'}
            margin={'none'}
          />
          <IconButton onClick={() => handleRemove(option.id)}>
            <DeleteIcon />
          </IconButton>
        </FlexRow>
      ))}
      <Button onClick={handleAddOption}>Add option</Button>
    </FlexCol>
  );
};

// =========================
// INPUT TYPES (CONSTANT)
// =========================

export const INPUT_TYPES: InputType[] = [
  {
    title: 'ShortText',
    element: (props: InputTypeElementProps) => (
      <MuiTextField placeholder={'Réponse courte'} {...props} />
    ),
    defaultSchema: { type: 'string' },
  },
  {
    title: 'LongText',
    element: (props: InputTypeElementProps) => (
      <MuiTextField
        multiline
        rows={3}
        placeholder={'Réponse longue'}
        {...props}
      />
    ),
    defaultSchema: { type: 'string' },
  },
  {
    title: 'Number',
    element: NumberField,
    defaultSchema: { type: 'number' },
  },
  {
    title: 'Spinner',
    element: SpinnerField,
    defaultSchema: { type: 'integer' },
  },
  {
    title: 'Date',
    element: DateField,
    defaultSchema: { type: 'string', format: 'date' },
  },
  {
    title: 'Time',
    element: TimeField,
    defaultSchema: { type: 'string', format: 'time' },
  },
  {
    title: 'Date time',
    element: DateTimeField,
    defaultSchema: { type: 'string', format: 'date-time' },
  },
  {
    title: 'Multiple choice',
    element: MultipleChoiceInput,
    defaultSchema: {
      type: 'array',
      items: { type: 'string', enum: ['Option 1', 'Option 2'] },
      uniqueItems: true,
    },
    additionalInputs: (props) => (
      <MultipleChoiceAdditionalInput {...props} multiple />
    ),
  },
  {
    title: 'Enum',
    element: ChoiceInput,
    defaultSchema: { enum: ['Option 1', 'Option 2'], type: 'string' },
    additionalInputs: MultipleChoiceAdditionalInput,
  },
];

// =========================
// BASE QUESTION COMPONENT
// =========================

export function BaseQuestion({ nodeId }: { nodeId: UUID }) {
  const { jsonForm, updateNode, lang } = useJsonForm();
  const node = jsonForm.nodes[nodeId] as ControlNode;

  const setTitle = useCallback(
    (val) =>
      updateNode(nodeId, {
        label: {
          fr: node.label?.fr ?? '',
          en: node.label?.en ?? '',
          [lang]: val,
        },
      }),
    [lang, node.label, nodeId, updateNode],
  );

  const setDescription = useCallback(
    (val) =>
      updateNode(nodeId, {
        description: {
          fr: node.description?.fr ?? '',
          en: node.description?.en ?? '',
          [lang]: val,
        },
      }),
    [lang, node.description, nodeId, updateNode],
  );

  const setRequired = useCallback(
    (val) => updateNode(nodeId, { schema: { ...node.schema, required: val } }),
    [node.schema, nodeId, updateNode],
  );

  const input = useMemo(
    () => INPUT_TYPES.find((c) => c.title === node.inputType),
    [node.inputType],
  );

  const setInput = useCallback(
    (val) => {
      const input = INPUT_TYPES.find((c) => c.title === val);
      if (!input) return;
      updateNode(nodeId, {
        inputType: input.title,
        schema: clone(input.defaultSchema),
      });
    },
    [nodeId, updateNode],
  );

  const id = `select_type-${nodeId}`;
  const label = 'Select the type';

  const hasType = Boolean(input?.title);

  return (
    <>
      <FlexAuto gap={1} mb={1}>
        <TextField
          handleChange={(val) => setTitle(val)}
          label={'Question'}
          size={'medium'}
          value={node.label?.[lang]}
          margin={'none'}
          disabled={!hasType}
        />
        <FormControl fullWidth margin={'none'}>
          <InputLabel id={id}>{label}</InputLabel>
          <Select
            variant={'outlined'}
            onChange={(e) => setInput(e.target.value)}
            label={label}
            labelId={id}
            value={input?.title ?? ''}
          >
            {INPUT_TYPES.map((child) => (
              <MenuItem key={child.title} value={child.title}>
                {child.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FlexAuto>
      <FlexAuto columnGap={2} alignItems={'center'} mb={1}>
        <TextField
          handleChange={(val) => setDescription(val)}
          label={'Description'}
          size={'small'}
          value={node.description?.[lang]}
          margin={'none'}
          disabled={!hasType}
        />
        <FormControl margin={'none'}>
          <FormControlLabel
            label={'Requis'}
            value={node.schema?.required}
            control={<Switch onChange={(e) => setRequired(e.target.checked)} />}
            disabled={!hasType}
          />
        </FormControl>
      </FlexAuto>
      {input?.additionalInputs && <input.additionalInputs nodeId={nodeId} />}
      {input && (
        <input.element
          label={node.label?.[lang] ?? node.schema?.title}
          helperText={node.description?.[lang] ?? node.schema?.description}
          required
          fullWidth
          margin={'normal'}
          nodeId={nodeId}
        />
      )}
    </>
  );
}
