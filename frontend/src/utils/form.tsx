import React, { useEffect, useState } from 'react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Delete } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';

import Avatar from '#components/Avatar/Avatar';
import { useTranslation } from '#i18n/useTranslation';
import { FieldType } from '#types/GenericTypes';

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
  const { t } = useTranslation();
  /**
   * Update the value of a key in the values object.
   *
   * @param name - the name of the field, and the key of the object in 'values'
   * @param value - the new value for this field
   */
  const handleChange = (name: string, value: any) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <>
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
                <FormControl fullWidth variant="outlined">
                  <TextField
                    key={field.name}
                    id={`${field.name}-number`}
                    name={field.name}
                    label={field.label}
                    value={values[field.name] ?? ''}
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        Number.parseInt(e.target.value, 10) || ''
                      )
                    }
                    error={!!error}
                    helperText={error}
                    required={field.required}
                    margin="dense"
                    type="number"
                    disabled={field.disabled}
                    defaultValue={field.default}
                    InputProps={{
                      inputProps: {
                        min: field.min,
                        max: field.max,
                        step: field.step,
                      },
                    }}
                  />
                </FormControl>
              </Box>
            );
          // case 'password':
          //   return (
          //     <Box sx={{ minWidth: 120, mt: 2 }} key={field.name}>
          //       <FormControl fullWidth>
          //         <InputLabel id={`${field.name}-password`}>
          //           {field.label}
          //         </InputLabel>
          //         <Input
          //           key={field.name}
          //           id={`${field.name}-password`}
          //           name={field.name}
          //           value={values[field.name]}
          //           onChange={(e) => handleChange(field.name, e.target.value)}
          //           margin="dense"
          //           type="password"
          //           disabled={field.disabled}
          //         />
          //       </FormControl>
          //     </Box>
          //   );
          case 'link':
            return (
              <Box sx={{ minWidth: 120, mt: 2 }} key={field.name}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    key={field.name}
                    id={`${field.name}-number`}
                    name={field.name}
                    label={field.label}
                    value={values[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    margin="dense"
                    type="url"
                    disabled={field.disabled}
                    error={!!error}
                    helperText={error || field.helpText}
                  />
                </FormControl>
              </Box>
            );
          case 'comment':
            return (
              <Typography
                sx={{
                  overflowWrap: 'break-word',
                  marginTop: 3,
                  marginBottom: 3,
                }}
                key={field.name}
              >
                {field.text}
              </Typography>
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
                    error={!!error}
                  >
                    {field.item.map((name) => (
                      <MenuItem key={name.toString()} value={name[1]}>
                        {name[0]}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error={!!error}>
                    {error || field.helpText}
                  </FormHelperText>
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
          case 'file':
            // eslint-disable-next-line no-case-declarations
            const imageName: string =
              values[field.name]?.name ||
              (typeof values[field.name] === 'string' && values[field.name]);
            return (
              <Box
                sx={{
                  minWidth: 120,
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
                key={field.name}
              >
                <TextField
                  variant="outlined"
                  disabled
                  fullWidth
                  spellCheck={false}
                  contentEditable={false}
                  helperText={error || field.description}
                  label={field.label}
                  required={field.required}
                  value={imageName || t('form.noFile')}
                  InputProps={{
                    endAdornment: imageName && (
                      <InputAdornment position="start">
                        <IconButton
                          size="small"
                          sx={{ padding: 0 }}
                          onClick={() =>
                            handleChange(field.name, new File([], ''))
                          }
                        >
                          <Delete />
                        </IconButton>
                      </InputAdornment>
                    ),
                    startAdornment: (
                      <InputAdornment position="start">
                        <Button
                          disabled={field.disabled}
                          variant="contained"
                          component="label"
                          size="small"
                          sx={{ marginRight: 1 }}
                        >
                          {t('form.chooseFile')}
                          <input
                            disabled={field.disabled}
                            hidden
                            accept="image/*"
                            multiple
                            value={undefined}
                            type="file"
                            onChange={(event) => {
                              if (event.target.files.length > 0)
                                handleChange(field.name, event.target.files[0]);
                            }}
                          />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  error={!!error}
                  sx={{ marginBottom: 1 }}
                />
              </Box>
            );
          case 'date': // date as string
            return (
              <LocalizationProvider
                adapterLocale="fr"
                dateAdapter={AdapterDayjs}
                key={field.name}
              >
                <DatePicker
                  label={field.label}
                  value={values[field.name] && dayjs(values[field.name])}
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
                  // renderInput={(params) => (
                  //   <TextField
                  //     {...params}
                  //     id={`${field.name}-input`}
                  //     name={field.name}
                  //     fullWidth={!noFullWidth}
                  //     required={field.required}
                  //     helperText={error || field.helpText}
                  //     error={!!error}
                  //     margin="normal"
                  //     value={undefined}
                  //   />
                  // )}
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
                disabled={field.disabled}
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
                  value={values[field.name]}
                  control={<Checkbox name={field.name} />}
                />
              </FormControl>
            );
          case 'richtext':
            return (
              <Box
                key={field.name}
                sx={{
                  minWidth: 120,
                  backgroundColor: 'primary',
                  position: 'relative',
                }}
              >
                <FormLabel error={!!error}>{field.label}</FormLabel>
                <div style={{ color: 'black' }}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={values[field.name]}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      handleChange(field.name, data);
                    }}
                  />
                </div>
                <FormHelperText sx={{ m: 0 }}>
                  {error || field.helpText}
                </FormHelperText>
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
          case 'image-autocomplete':
            return (
              <ImageAutocompleteField
                controlValue={values[field.name]}
                error={error}
                field={field}
                handleChange={handleChange}
                key={field.name}
              />
            );
          case 'datetime':
            return (
              <LocalizationProvider
                adapterLocale="fr"
                dateAdapter={AdapterDayjs}
                key={field.name}
              >
                <DateTimePicker
                  label={field.label}
                  value={values[field.name] && dayjs(values[field.name])}
                  disablePast={field.disablePast}
                  onChange={(newValue: Dayjs | null) => {
                    handleChange(field.name, newValue);
                  }}
                  // text={() => (
                  //   <TextField
                  //     id={`${field.name}-input`}
                  //     name={field.name}
                  //     fullWidth={!noFullWidth}
                  //     required={field.required}
                  //     helperText={error || field.helpText}
                  //     error={!!error}
                  //     margin="normal"
                  //     value={undefined}
                  //     disabled={field.disabled}
                  //   />
                  // )}
                />
              </LocalizationProvider>
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

function ImageAutocompleteField(props: {
  field;
  handleChange;
  error;
  controlValue;
}) {
  const { field, handleChange, error, controlValue } = props;
  const [value, setValue] = React.useState(controlValue);
  React.useEffect(() => {
    const selectedObject = field.options?.find(
      (item) => (item[field.pk] || item.id) === controlValue
    );
    if (selectedObject) setValue(selectedObject);
  }, [controlValue]);

  return (
    <Autocomplete
      key={field.name}
      value={value || null}
      options={field.options}
      fullWidth
      freeSolo={field.freeSolo}
      disabled={field.disabled}
      isOptionEqualToValue={(option: any, val: any) =>
        option[field.pk || 'id'] === val[field.pk || 'id']
      }
      onChange={(e, val) => {
        setValue(val);
        handleChange(field.name, val ? val[field.pk || 'id'] : null);
      }}
      getOptionLabel={(option) => {
        return option && field.getOptionLabel(option);
      }}
      renderOption={(properties, option) => (
        <Box
          component="li"
          sx={{ display: 'flex', columnGap: 1 }}
          {...properties}
        >
          {field.getIcon && field.getOptionLabel(option) && (
            <Avatar
              title={field.getOptionLabel(option)}
              size="small"
              url={field.getIcon(option)}
            />
          )}
          {field.getOptionLabel(option)}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          id={`${field.name}-input`}
          name={field.name}
          fullWidth
          required={field.required}
          helperText={error || field.helpText}
          error={!!error}
          margin="normal"
          disabled={field.disabled}
          label={field.label}
          InputProps={{
            ...params.InputProps,
            startAdornment: field.getIcon && value && (
              <InputAdornment position="start">
                <Avatar
                  title={field.getOptionLabel(value)}
                  size="small"
                  url={field.getIcon(value)}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
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
    if (reason !== 'input' || newValue.length < field.minLetterCount) return;
    axios
      .get<any[]>(`${field.endPoint}/search/`, {
        params: { q: newValue, ...field.queryParams },
      })
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

FormGroup.defaultProps = {
  errors: {},
  noFullWidth: false,
};

export default FormGroup;
