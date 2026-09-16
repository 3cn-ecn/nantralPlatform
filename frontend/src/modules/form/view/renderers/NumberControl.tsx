import { useMemo } from 'react';

import {
  ControlProps,
  isIntegerControl,
  isNumberControl,
  or,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { WithInput } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import merge from 'lodash/merge';

import { NumberField, SpinnerField } from '#shared/components/FormFields';

export const NumberControl = ({
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
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  const Field = useMemo(
    () => (appliedUiSchemaOptions.spinner ? SpinnerField : NumberField),
    [appliedUiSchemaOptions.spinner],
  );

  if (!visible) {
    return null;
  }

  return (
    <Field
      label={label}
      value={data}
      handleChange={(val) => handleChange(path, val)}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      fullWidth={!appliedUiSchemaOptions.trim}
      errors={errors.length > 0 ? errors.split('\n') : undefined}
      required={required}
      helperText={description}
      step={schema.multipleOf ?? (schema.type === 'integer' ? 1 : 0.1)}
      maximum={schema.maximum}
      minimum={schema.minimum}
      type={schema.type === 'integer' ? 'numeric' : 'decimal'}
    />
  );
};

export const numberControlTester: RankedTester = rankWith(
  2,
  or(isNumberControl, isIntegerControl),
);
export default withJsonFormsControlProps(NumberControl);
