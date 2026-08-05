import { useMemo } from 'react';

import {
  ControlProps,
  isStringControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { WithInput } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { InputBaseComponentProps } from '@mui/material';
import merge from 'lodash/merge';

import { TextField } from '#shared/components/FormFields';
import { PasswordField } from '#shared/components/FormFields/PasswordField';

export const TextControl = ({
  id,
  description,
  errors,
  label,
  uischema,
  visible,
  required,
  config,
  path,
  handleChange,
  data,
  schema,
  enabled,
}: ControlProps & WithInput) => {
  const maxLength = schema.maxLength;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  let inputProps: InputBaseComponentProps;
  if (appliedUiSchemaOptions.restrict) {
    inputProps = { maxLength: maxLength };
  } else {
    inputProps = {};
  }

  if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
    inputProps.size = maxLength;
  }

  const Field = useMemo(
    () =>
      appliedUiSchemaOptions.format === 'password' ? PasswordField : TextField,
    [appliedUiSchemaOptions.format],
  );

  if (!visible) {
    return null;
  }

  return (
    <Field
      label={label}
      value={data}
      handleChange={(val) => handleChange(path, val ?? '')}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      multiline={
        appliedUiSchemaOptions.multi &&
        appliedUiSchemaOptions.format !== 'password'
      }
      fullWidth={!appliedUiSchemaOptions.trim || schema.maxLength === undefined}
      minRows={appliedUiSchemaOptions.multi && 2}
      slotProps={{ htmlInput: inputProps }}
      errors={errors.length > 0 ? errors.split('\n') : undefined}
      required={required}
      helperText={description}
    />
  );
};

export const textControlTester: RankedTester = rankWith(1, isStringControl);
export default withJsonFormsControlProps(TextControl);
