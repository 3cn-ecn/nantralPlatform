import React, { useEffect, useState } from 'react';

import {
  Autocomplete,
  AutocompleteInputChangeReason,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { fr } from 'date-fns/locale';
import { noop } from 'lodash-es';

import axios from './axios';

export type FieldType =
  | {
      kind: 'text' | 'integer' | 'float' | 'boolean' | 'date';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      rows?: number;
    }
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min: number;
      max: number;
      step: number;
      default: number;
    }
  | {
      kind: 'picture';
      title: string;
      description: string;
    }
  | {
      kind: 'select';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      item?: string[];
    }
  | {
      kind: 'group';
      fields?: (FieldType & { name: string })[];
    }
  | {
      kind: 'custom';
      name: string;
      component: (props: { error?: boolean }) => JSX.Element;
    }
  | {
      kind: 'autocomplete';
      name: string;
      label: string;
      required?: boolean;
      helpText?: string;
      endPoint: string;
      freeSolo?: boolean;
      getOptionLabel: (option: any) => string;
      pk?: any;
    };

/**
 * A component to create a group of fields for a form.
 *
 * You **SHOULD NOT** use this component to make forms, it was a mistake done by
 * me when I started to learn React...
 *
 * @param props.fields - the list of the structure of each field
 * @param props.values - an object { key: value } where keys are the 'name' key in the field structure
 * @param props.errors - a list of errors for each field (usually sent back by the server)
 * @param props.setValues - A function to update the values (usually with useState)
 * @param props.noFullWidth - Prevent the fields to have width=100%. Only used on recursive calls
 * @returns
 */
function FormGroup(props: {
  fields: FieldType[];
  values: any;
  errors?: any;
  setValues: (values: any) => void;
  noFullWidth?: boolean;
}) {
  const { fields, values, errors, setValues, noFullWidth } = props;

  /**
   * Update the value of a key in the values object.
   *
   * @param name - the name of the field, and the key of the object in 'values'
   * @param value - the new value for this field
   */
  function handleChange(name: string, value: any) {
    setValues({
      ...values,
      [name]: value,
    });
  }

  return (
    <>
      {fields.map((field) => {
        const error =
          field.kind !== 'group' &&
          field.kind !== 'picture' &&
          errors &&
          errors[field.name];
        switch (field.kind) {
          case 'group':
            return (
              <Box
                sx={{ display: 'flex', gap: 1.5 }}
                key={field.fields.reduce(
                  (prev, curr) => `${prev}+${curr.name}`,
                  '',
                )}
              >
                <FormGroup
                  fields={field.fields}
                  values={values}
                  errors={errors}
                  setValues={setValues}
                  noFullWidth
                />
              </Box>
            );
          case 'number':
            return (
              <Box sx={{ minWidth: 120, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id={`${field.name}-number`}>
                    {field.label}
                  </InputLabel>
                  <Input
                    key={field.name}
                    id={`${field.name}-number`}
                    name={field.name}
                    value={values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    type="number"
                    defaultValue={field.default}
                    slotProps={{
                      input: {
                        min: field.min,
                        max: field.max,
                        step: field.step,
                      },
                    }}
                  />
                </FormControl>
              </Box>
            );
          case 'select':
            return (
              <Box sx={{ minWidth: 120, mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id={`${field.name}-input`}>
                    {field.label}
                  </InputLabel>
                  <Select
                    key={field.name}
                    labelId="demo-simple-select-label"
                    id={`${field.name}-input`}
                    name={field.name}
                    label={field.label}
                    value={values[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    {field.item.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            );
          case 'text':
            return (
              <TextField
                key={field.name}
                id={`${field.name}-input`}
                name={field.name}
                label={field.label}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                fullWidth={!noFullWidth}
                required={field.required}
                inputProps={{ maxLength: field.maxLength }}
                helperText={error || field.helpText}
                error={!!error}
                margin="normal"
                multiline={field.multiline}
                rows={field.rows}
              />
            );
          case 'picture':
            return (
              <Box sx={{ minWidth: 120, mt: 2 }}>
                <FormControl fullWidth>
                  <Button variant="contained" component="label">
                    {field.description}
                    <input hidden accept="image/*" multiple type="file" />
                  </Button>
                </FormControl>
              </Box>
            );
          case 'date': // date as string
            return (
              <LocalizationProvider
                adapterLocale={fr}
                dateAdapter={AdapterDateFns}
                key={field.name}
              >
                <DatePicker
                  label={field.label}
                  value={values[field.name] && new Date(values[field.name])}
                  onChange={(val) => {
                    if (val && val.toString() !== 'Invalid Date') {
                      handleChange(
                        field.name,
                        new Intl.DateTimeFormat('en-GB')
                          .format(val)
                          .split('/')
                          .reverse()
                          .join('-'),
                      );
                    } else {
                      handleChange(field.name, val);
                    }
                  }}
                  slotProps={{
                    textField: {
                      id: `${field.name}-input`,
                      name: field.name,
                      fullWidth: !noFullWidth,
                      required: field.required,
                      helperText: error || field.helpText,
                      error: !!error,
                      margin: 'normal',
                    },
                  }}
                />
              </LocalizationProvider>
            );
          case 'boolean':
            return (
              <FormControl
                key={field.name}
                id={`${field.name}-input`}
                required={field.required}
                error={!!error}
                margin="normal"
              >
                <FormControlLabel
                  label={
                    <>
                      <Typography color={error ? 'error' : undefined}>
                        {`${field.label}${field.required ? ' *' : ''}`}
                      </Typography>
                      <FormHelperText sx={{ m: 0 }}>
                        {error || field.helpText}
                      </FormHelperText>
                    </>
                  }
                  checked={values[field.name]}
                  onChange={(e: any) =>
                    handleChange(field.name, e.target.checked)
                  }
                  control={<Checkbox name={field.name} />}
                />
              </FormControl>
            );
          case 'autocomplete':
            return (
              <AutocompleteField
                key={field.name}
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
            return <></>;
        }
      })}
    </>
  );
}

/**
 * A field for searching on the API with autocomplete
 *
 * @param props.field - the field
 * @param props.field.endPoint - the base url of the api router where to make the search
 * @param props.value - the value for this field
 * @param props.error - the error for this field
 * @param props.handleChange - a function to update the value
 * @param props.noFullWidth - prevent the field to be set to width=100%
 * @returns
 */
function AutocompleteField<T>(props: {
  field: FieldType & { kind: 'autocomplete' };
  value: any;
  error: any;
  handleChange: (name: string, value: any) => void;
  noFullWidth: boolean;
}) {
  const { field, value, error, handleChange, noFullWidth } = props;

  const [options, setOptions] = useState<T[]>([]);
  const [selectedOption, setSelectedOption] = useState<T | string>(null);

  useEffect(() => {
    if (value) {
      axios
        .get<T>(`${field.endPoint}/${value}/`)
        .then((res) => setSelectedOption(res.data));
    }
  }, [field.endPoint, value]);

  function updateOptions(
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ): void {
    if (reason !== 'input' || value.length < 3) return;
    axios
      .get<any[]>(`${field.endPoint}/`, { params: { search: value } })
      .then((res) => setOptions(res.data.results))
      .catch(noop);
  }

  return (
    <Autocomplete
      id={`${field.name}-input`}
      value={selectedOption}
      onChange={(e, val: T, reason) => {
        if (reason === 'selectOption') {
          setSelectedOption(val);
          handleChange(field.name, val[field.pk || 'id']);
        }
      }}
      options={options}
      filterOptions={(x) => x}
      getOptionLabel={field.getOptionLabel}
      fullWidth={!noFullWidth}
      freeSolo={field.freeSolo}
      onInputChange={updateOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          name={field.name}
          label={field.label}
          required={field.required}
          helperText={error || field.helpText}
          error={!!error}
          margin="normal"
        />
      )}
    />
  );
}

export default FormGroup;
