import { useMemo } from 'react';

import {
  ControlProps,
  isBooleanControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { WithInput } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import merge from 'lodash/merge';

import { CheckboxField, SwitchField } from '#shared/components/FormFields';

export const BooleanControl = ({
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
  enabled,
}: ControlProps & WithInput) => {
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const inputProps = {
    autoFocus: !!appliedUiSchemaOptions.focus,
  };

  // !! causes undefined value to be converted to false, otherwise has no effect
  const checked = !!data;

  const Field = useMemo(
    () =>
      appliedUiSchemaOptions.toggle === true ? SwitchField : CheckboxField,
    [appliedUiSchemaOptions.toggle],
  );

  if (!visible) {
    return null;
  }

  return (
    <Field
      label={label}
      value={checked}
      handleChange={(val) => handleChange(path, val ?? '')}
      id={id}
      disabled={!enabled}
      checkboxProps={inputProps}
      errors={errors.length > 0 ? errors.split('\n') : undefined}
      required={required}
      helperText={description}
    />
  );
};

export const booleanControlTester: RankedTester = rankWith(
  100,
  isBooleanControl,
);
export default withJsonFormsControlProps(BooleanControl);
