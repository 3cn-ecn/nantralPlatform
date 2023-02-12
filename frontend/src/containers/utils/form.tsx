import React, { useEffect, useState } from 'react';
import {
  TextField,
  Checkbox,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
  Autocomplete,
  AutocompleteInputChangeReason
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr';
import axios from './axios';

export type FieldType = {
  kind: 'text' | 'integer' | 'float' | 'boolean' | 'date';
  name: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  helpText?: string;
  multiline?: boolean;
} | {
  kind: 'group';
  fields?: FieldType[];
} | {
  kind: 'custom';
  name: string;
  component: (props: {error?: boolean}) => JSX.Element;
} | {
  kind: 'autocomplete';
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  endPoint: string;
  freeSolo?: boolean;
  getOptionLabel: (option: any) => string;
  pk?: any;
}

function FormGroup(props: {
  fields: FieldType[],
  values: any,
  errors?: any,
  setValues: (values: any) => void,
  noFullWidth?: boolean
}) {
  const { fields, values, errors, setValues, noFullWidth } = props;

  function handleChange(name: string, value: any) {
    setValues({
      ...values,
      [name]: value,
    });
  }

  return <>
    {fields.map((field, index) => {
      const error = field.kind !== 'group' && errors && errors[field.name];
      switch (field.kind) {
        case 'group':
          return (
            <Box sx={{display: 'flex', gap: 1.5 }} key={index}>
              <FormGroup
                fields={field.fields}
                values={values}
                setValues={setValues}
                noFullWidth
              />
            </Box>
          );
        case 'text':
          return (
            <TextField
              key={index}
              id={`${field.name}-input`}
              name={field.name}
              label={field.label}
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              fullWidth={!noFullWidth}
              required={field.required}
              inputProps={{ maxLength: field.maxLength }}
              helperText={error ? error : field.helpText}
              error={!!error}
              margin='normal'
              multiline={field.multiline}
            />
          );
        case 'date':  // date as string
          return (
            <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs} key={index}>
              <DatePicker
                label={field.label}
                value={new Date(values[field.name])}
                onChange={(val) => handleChange(field.name, val?.toISOString().split('T')[0])}
                renderInput={(params) => 
                  <TextField {...params}
                    id={`${field.name}-input`}
                    name={field.name}
                    fullWidth={!noFullWidth}
                    required={field.required}
                    helperText={error ? error : field.helpText}
                    error={!!error}
                    margin='normal'
                  />
                }
              />
            </LocalizationProvider>
          );
        case 'boolean':
          return (
            <FormControl
              key={index}
              id={`${field.name}-input`}
              required={field.required}
              error={!!error}
              margin='normal'
            >
              <FormControlLabel
                label={
                  <>
                    <Typography color={error ? 'error' : undefined}>
                      {`${field.label}${field.required ? ' *' : ''}`}
                    </Typography>
                    <FormHelperText sx={{ m: 0 }}>
                      {error ? error : field.helpText}
                    </FormHelperText>
                  </>
                }
                checked={values[field.name]}
                onChange={(e: any) => handleChange(field.name, e.target.checked)}
                control={<Checkbox name={field.name} />}
              />
            </FormControl>
          );
        case 'autocomplete':
          return (
            <AutocompleteField
              key={index}
              field={field}
              value={values[field.name]}
              error={error}
              handleChange={handleChange}
              noFullWidth={noFullWidth}
            />
          );
        case 'custom':
          return <field.component error={!!error} />;
        default:
          return (
            <></>
          )
      };
    })}
  </>
}

function AutocompleteField<T>(props: {
  field: FieldType,
  value: any,
  error: any,
  handleChange: (name: string, value: string) => void,
  noFullWidth: boolean,
}) {
  const { field, value, error, handleChange, noFullWidth } = props;
  if (field.kind !== 'autocomplete') return <></>;

  const [ options, setOptions ] = useState<T[]>([]);
  const [ selectedOption, setSelectedOption ] = useState<T | string>('');
  const endPoint = field.endPoint;

  useEffect(() => {
    if (value) {
      axios
      .get<T>(`${endPoint}/${value}/`)
      .then((res) => setSelectedOption(res.data));
    }
  }, []);

  function updateOptions(
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason
  ): void {
    if (reason !== 'input') return;
    axios
      .get<any[]>(`${endPoint}/search/`, { params: { q: value } })
      .then((res) => setOptions(res.data))
      .catch(() => {});
  };

  return (
    <Autocomplete
      id={`${field.name}-input`}
      value={selectedOption}
      onChange={(e, val, reason) => {
        if (reason === 'selectOption') {
          setSelectedOption(val as T);
          handleChange(field.name, (val as T)[field.pk || 'id']);
        }
      }}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={field.getOptionLabel}
      fullWidth={!noFullWidth}
      freeSolo={field.freeSolo}
      onInputChange={updateOptions}
      renderInput={(params) => (
        // component used for the input
        <TextField
          {...params}
          name={field.name}
          label={field.label}
          required={field.required}
          helperText={error ? error : field.helpText}
          error={!!error}
          margin='normal'
        />
      )}
    />
  );
};

export default FormGroup;
