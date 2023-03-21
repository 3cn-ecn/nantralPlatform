import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  TextField,
  Checkbox,
  Box,
  Select,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
  Autocomplete,
  MenuItem,
  InputLabel,
  AutocompleteInputChangeReason,
  Input,
  Button,
  useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr';
import axios from 'axios';
import { DateTimePicker } from '@mui/x-date-pickers';

document.documentElement.style.setProperty('--ck-custom-foreground', 'black');

export type FieldType =
  | {
      kind: 'text' | 'integer' | 'float' | 'boolean';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      rows: number;
      disabled?: boolean;
    }
  | {
      kind: 'date';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      rows: number;
      disabled?: boolean;
      type?: 'date' | 'date and time';
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
      disabled?: boolean;
    }
  | {
      kind: 'picture';
      label: string;
      description: string;
      disabled?: boolean;
      name: string;
      required?: boolean;
    }
  | {
      kind: 'select';
      name: string;
      label: string;
      required?: boolean;
      maxLength?: number;
      helpText?: string;
      multiline?: boolean;
      item?: Array<Array<string>>;
      disabled?: boolean;
    }
  | {
      kind: 'CKEditor';
      name: string;
      label: string;
      helpText?: string;
      disabled?: boolean;
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
      disabled?: boolean;
    };

/**
 * A component to create a group of fields for a form
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
  const handleChange = (name: string, value: any) => {
    console.log(name, value);
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <>
      <link rel="stylesheet" href="custom.css" type="text/css" />
      {fields.map((field) => {
        const error = field.kind !== 'group' && errors && errors[field.name];
        switch (field.kind) {
          case 'group':
            return (
              <Box
                sx={{ display: 'flex', gap: 1.5 }}
                key={field.fields.reduce(
                  (prev, curr) => `${prev}+${curr.name}`,
                  ''
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
              <Box sx={{ minWidth: 120, mt: 2 }} key={field.name}>
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
                    margin="dense"
                    type="number"
                    disabled={field.disabled}
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
              <Box sx={{ minWidth: 120, mt: 2 }} key={field.name}>
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
                    margin="dense"
                    disabled={field.disabled}
                  >
                    {field.item.map((name) => (
                      <MenuItem key={name.toString()} value={name[1]}>
                        {name[0]}
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
                disabled={field.disabled}
              />
            );
          case 'picture':
            return (
              <Box sx={{ minWidth: 120, mt: 2 }} key={field.name}>
                <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  label={field.label}
                  required={field.required}
                  value={
                    values[field.name]?.name || values[field.name] || 'No image'
                  }
                  error={!!error}
                  sx={{ marginBottom: 1 }}
                  // helperText={error || field.description}
                />
                <Button
                  disabled={field.disabled}
                  variant="contained"
                  component="label"
                  sx={{ height: '100%', marginRight: 1 }}
                >
                  CHOOSE FILE
                  <input
                    disabled={field.disabled}
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={(event) => {
                      console.log(event.target.files);
                      if (event.target.files.length > 0)
                        handleChange(field.name, event.target.files[0]);
                    }}
                  />
                </Button>
                <Button
                  disabled={field.disabled}
                  variant="outlined"
                  onClick={() => handleChange(field.name, null)}
                >
                  DELETE
                </Button>
              </Box>
            );
          case 'date': // date as string
            return (
              <LocalizationProvider
                adapterLocale="fr"
                dateAdapter={AdapterDayjs}
                key={field.name}
              >
                {field.type !== 'date and time' ? (
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
                            .join('-')
                        );
                      } else {
                        handleChange(field.name, val);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id={`${field.name}-input`}
                        name={field.name}
                        fullWidth={!noFullWidth}
                        required={field.required}
                        helperText={error || field.helpText}
                        error={!!error}
                        margin="normal"
                      />
                    )}
                  />
                ) : (
                  <DateTimePicker
                    label={field.label}
                    value={values[field.name] && new Date(values[field.name])}
                    onChange={(val) => {
                      if (val && val.toString() !== 'Invalid Date') {
                        handleChange(field.name, new Date(val.toISOString()));
                      } else {
                        handleChange(field.name, val);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id={`${field.name}-input`}
                        name={field.name}
                        fullWidth={!noFullWidth}
                        required={field.required}
                        helperText={error || field.helpText}
                        error={!!error}
                        margin="normal"
                      />
                    )}
                  />
                )}
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
          case 'CKEditor':
            return (
              <Box
                key={field.name}
                sx={{
                  minWidth: 120,
                  mt: 2,
                  backgroundColor: 'primary',
                  color: 'black',
                }}
              >
                <Typography color="rgba(255, 255, 255, 0.7)" fontSize="1rem">
                  {field.label}
                </Typography>
                <CKEditor
                  editor={ClassicEditor}
                  data={values[field.name]}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    handleChange(field.name, data);
                  }}
                  onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                  }}
                />
              </Box>
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
            return null;
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
  }, []);

  const updateOptions = (
    event: React.SyntheticEvent,
    newValue: string,
    reason: AutocompleteInputChangeReason
  ): void => {
    if (reason !== 'input' || newValue.length < 3) return;
    axios
      .get<any[]>(`${field.endPoint}/search/`, { params: { q: newValue } })
      .then((res) => setOptions(res.data))
      .catch((err) => {
        console.error(err);
      });
  };

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
      disabled={field.disabled}
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
