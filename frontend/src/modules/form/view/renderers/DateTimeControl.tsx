import { useMemo } from 'react';

import {
  ControlProps,
  isDateControl,
  isDateTimeControl,
  or,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { WithInput } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import merge from 'lodash/merge';

import { DateField, DateTimeField } from '#shared/components/FormFields';

export const DateTimeControl = ({
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
  const format = appliedUiSchemaOptions.dateFormat;

  const hasTime = schema.format?.endsWith('time');

  const views = appliedUiSchemaOptions.views;
  const closeOnSelect = appliedUiSchemaOptions.closeOnSelect ?? true;

  const Field = useMemo(() => (hasTime ? DateTimeField : DateField), [hasTime]);

  if (!visible) {
    return null;
  }

  return (
    <Field
      label={label}
      value={new Date(data)}
      onChange={(val) =>
        handleChange(
          path,
          hasTime
            ? val?.toISOString()
            : (val?.toISOString().split('T')[0] ?? ''),
        )
      }
      disabled={!enabled}
      fullWidth={!appliedUiSchemaOptions.trim}
      ampm={hasTime && appliedUiSchemaOptions.ampm}
      slotProps={{
        textField: {
          id: id,
          inputProps: { autoFocus: appliedUiSchemaOptions.focus },
        },
      }}
      errors={errors.length > 0 ? errors.split('\n') : undefined}
      required={required}
      helperText={description}
      format={format}
      views={views}
      closeOnSelect={closeOnSelect}
    />
  );
};

export const dateTimeControlTester: RankedTester = rankWith(
  150,
  or(isDateControl, isDateTimeControl),
);
export default withJsonFormsControlProps(DateTimeControl);
