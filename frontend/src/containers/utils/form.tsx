import React from 'react';
import {
  TextField,
  Checkbox,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr';

interface Field {
  kind: 'text' | 'integer' | 'float' | 'boolean' | 'date' | 'custom' | 'group';
  name?: string;
  label?: string;
  required?: boolean;
  maxLength?: number;
  helpText?: string;
  error?: string;
  multiline?: boolean;
  component?: JSX.Element;
  fields?: Field[];
}

function FormGroup(props: {
  fields: Field[],
  values: any,
  setValues: (values: any) => void,
  noFullWidth?: boolean
}) {
  const { fields, values, setValues, noFullWidth } = props;

  function handleChange(name: string, value: any) {
    setValues({
      ...values,
      [name]: value,
    });
  }

  return <>
    {fields.map((field, index) => {
      switch (field.kind) {
        case 'group':
          return (
            <Box sx={{display: 'flex', gap: 1.5 }} key={index}>
              <FormGroup
                fields={field.fields!!}
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
              value={values[field.name!!]}
              onChange={(e) => handleChange(field.name!!, e.target.value)}
              fullWidth={!noFullWidth}
              required={field.required}
              inputProps={{ maxLength: field.maxLength }}
              helperText={field.error ? field.error : field.helpText}
              error={!!field.error}
              margin='normal'
              multiline={field.multiline}
            />
          );
        case 'date':  // date as string
          return (
            <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs} key={index}>
              <DatePicker
                label={field.label}
                value={new Date(values[field.name!!])}
                onChange={(val) => handleChange(field.name!!, val?.toISOString().split('T')[0])}
                renderInput={(params) => 
                  <TextField {...params}
                    id={`${field.name}-input`}
                    name={field.name}
                    fullWidth={!noFullWidth}
                    required={field.required}
                    helperText={field.error ? field.error : field.helpText}
                    error={!!field.error}
                    margin='normal'
                  />
                }
              />
            </LocalizationProvider>
          )
        case 'boolean':
          return (
            <FormControl
              key={index}
              id={`${field.name}-input`}
              required={field.required}
              error={!!field.error}
              margin='normal'
            >
              <FormControlLabel
                label={
                  <>
                    <Typography color={field.error ? 'error' : undefined}>
                      {`${field.label}${field.required ? ' *' : ''}`}
                    </Typography>
                    <FormHelperText sx={{ m: 0 }}>
                      {field.error ? field.error : field.helpText}
                    </FormHelperText>
                  </>
                }
                checked={values[field.name!!]}
                onChange={(e: any) => handleChange(field.name!!, e.target.checked)}
                control={<Checkbox name={field.name} />}
              />
            </FormControl>
          )
        case 'custom':
          return field.component;
        default:
          return (
            <></>
          )
      };
    })}
  </>
}

export default FormGroup;
