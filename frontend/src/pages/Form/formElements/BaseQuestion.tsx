import { FC, useCallback, useEffect, useMemo } from 'react';

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
  Typography,
} from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import { clone, get, toPath } from 'lodash';

import { JsonFormSchema } from '#modules/form/jsonForm.type';
import NumberField from '#pages/Form/FormFields/NumberField';
import SpinnerField from '#pages/Form/FormFields/SpinnerField';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { DateField, DateTimeField } from '#shared/components/FormFields';
import { TextField } from '#shared/components/FormFields/TextField';
import { TimeField } from '#shared/components/FormFields/TimeField';
import { useToast } from '#shared/context/Toast.context';

interface AdditionnalInputProps {
  jsonForm: JsonFormSchema;
  setJsonForm: (path: string, val: any) => void;
  path: string;
}

interface InputType {
  title: string;
  element: FC<any>;
  defaultSchema: any;
  additionalInputs?: FC<AdditionnalInputProps>;
}

const MultipleChoiceInput = ({ label, helperText, ...props }: Partial<any>) => {
  return (
    <FormControl>
      <FormLabel id={'id'}>{label}</FormLabel>
      <FormGroup aria-labelledby="demo-controlled-radio-buttons-group">
        {props.schema.items?.enum?.map((option: string) => (
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

const ChoiceInput = ({ label, helperText, ...props }: Partial<any>) => {
  return (
    <FormControl>
      <FormLabel id={'id'}>{label}</FormLabel>
      <RadioGroup aria-labelledby="demo-controlled-radio-buttons-group">
        {props.schema.enum.map((option: string) => (
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

const MultipleChoiceAdditionalInput = ({
  jsonForm,
  setJsonForm,
  path,
  multiple = false,
}: AdditionnalInputProps & { multiple: boolean }) => {
  const options = useMemo(
    () =>
      get(jsonForm, `schema${path}.enum`, []).map((option, i) => ({
        id: i,
        value: option,
      })),
    [jsonForm, path],
  );

  const dispatch = useCallback(
    (action: OptionsActionType) => {
      const newOptions = optionsReducer(options, action);
      setJsonForm(
        `schema${path}.enum`,
        newOptions.map((o) => o.value),
      );
    },
    [options, path, setJsonForm],
  );

  const showToast = useToast();
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

const inputTypes: InputType[] = [
  {
    title: 'ShortText',
    element: (props) => (
      <MuiTextField placeholder={'Réponse courte'} {...props} />
    ),
    defaultSchema: { type: 'string' },
  },
  {
    title: 'LongText',
    element: (props) => (
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
    defaultSchema: { type: 'number' },
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
      <MultipleChoiceAdditionalInput
        {...props}
        multiple
        path={props.path + '.items'}
      />
    ),
  },
  {
    title: 'Enum',
    element: ChoiceInput,
    defaultSchema: { enum: ['Option 1', 'Option 2'], type: 'string' },
    additionalInputs: MultipleChoiceAdditionalInput,
  },
];

interface BaseQuestionProps {
  path: string;
  jsonForm: JsonFormSchema;
  setJsonForm: (path: string | string[], val: any) => void;
}

export function BaseQuestion({
  path,
  jsonForm,
  setJsonForm,
}: BaseQuestionProps) {
  useEffect(() => {
    if (!get(jsonForm, `uiSchema${path}.scope`)) {
      // Get last added id
      const id =
        Math.max(
          ...(Object.keys(get(jsonForm, 'schema.properties', {})).map((key) =>
            parseInt(key),
          ) || 0),
          0,
        ) + 1;
      setJsonForm(`uiSchema${path}.scope`, `#/properties/${id}`);
      setJsonForm(`schema.properties.${id}`, {});
    }
  }, [jsonForm, path, setJsonForm]);
  const schemaPath = useMemo(
    () =>
      get(jsonForm, `uiSchema${path}.scope`, '')
        .replace('#', '')
        .replaceAll('/', '.'),
    [jsonForm, path],
  );
  const title = useMemo(
    () => get(jsonForm, `schema${schemaPath}.title`, 'Titre'),
    [jsonForm, schemaPath],
  );
  const setTitle = useCallback(
    (val) => setJsonForm(`schema${schemaPath}.title`, val),
    [schemaPath, setJsonForm],
  );
  const description = useMemo(
    () => get(jsonForm, `schema${schemaPath}.description`, ''),
    [jsonForm, schemaPath],
  );
  const setDescription = useCallback(
    (val) => setJsonForm(`schema${schemaPath}.description`, val),
    [schemaPath, setJsonForm],
  );
  const required = useMemo(
    () => get(jsonForm, `schema${schemaPath}.required`, false),
    [jsonForm, schemaPath],
  );
  const setRequired = useCallback(
    (val) => {
      const currentPath = toPath(schemaPath);
      const name = currentPath.pop();
      currentPath.pop(); // exit the property level
      const requiredPath = `schema${currentPath.join('.')}.required`;
      if (!name) return;
      const requiredList: string[] = get(jsonForm, requiredPath, []);
      if (val) {
        if (requiredList.includes(val)) return;
        requiredList.push(name);
      } else {
        requiredList.splice(requiredList.findIndex((e) => e === name) ?? -1, 1);
      }
      setJsonForm(requiredPath, requiredList);
    },
    [jsonForm, schemaPath, setJsonForm],
  );
  const input = useMemo(
    () =>
      inputTypes.find(
        (c) => c.title === get(jsonForm, `schema${schemaPath}.x-type`, ''),
      ),
    [jsonForm, schemaPath],
  );
  const setInput = useCallback(
    (val) => {
      const input = inputTypes.find((c) => c.title === val);
      if (!input) return;
      setJsonForm(`schema${schemaPath}`, clone(input.defaultSchema));
      setJsonForm(`schema${schemaPath}.x-type`, input.title);
    },
    [schemaPath, setJsonForm],
  );
  const schema = useMemo(
    () => get(jsonForm, `schema${schemaPath}`, {}),
    [jsonForm, schemaPath],
  );

  const id = schemaPath + '/select_type';
  const label = 'Select the type';
  return (
    <>
      <FlexRow gap={2}>
        <TextField
          handleChange={(val) => setTitle(val)}
          label={'Question'}
          size={'medium'}
          value={title}
        />
        <FormControl fullWidth margin={'normal'}>
          <InputLabel id={id}>{label}</InputLabel>
          <Select
            variant={'outlined'}
            onChange={(e) => setInput(e.target.value)}
            label={label}
            labelId={id}
            value={input?.title ?? ''}
          >
            {inputTypes.map((child) => (
              <MenuItem key={child.title} value={child.title}>
                {child.title}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Choisissez le type d&#39;élément que vous souhaitez ajouter
          </FormHelperText>
        </FormControl>
      </FlexRow>
      <FlexRow gap={2}>
        <TextField
          handleChange={(val) => setDescription(val)}
          label={'Description'}
          size={'small'}
          value={description}
        />
        <FormControl margin={'normal'}>
          <FormControlLabel
            label={'Requis'}
            value={required}
            control={<Switch onChange={(e) => setRequired(e.target.checked)} />}
          />
          <FormHelperText>
            Activez cette option pour rendre ce champ obligatoire
          </FormHelperText>
        </FormControl>
      </FlexRow>
      {input?.additionalInputs && (
        <input.additionalInputs
          jsonForm={jsonForm}
          setJsonForm={setJsonForm}
          path={schemaPath}
        />
      )}
      {input && (
        <>
          <Typography sx={{ my: 1 }}>Preview:</Typography>
          <input.element
            label={title}
            helperText={description}
            required
            fullWidth
            margin={'normal'}
            schema={schema}
          />
        </>
      )}
    </>
  );
}
