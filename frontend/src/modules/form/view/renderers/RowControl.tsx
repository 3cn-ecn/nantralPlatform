import {
  and,
  ControlProps,
  isObjectControl,
  optionIs,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { WithInput } from '@jsonforms/material-renderers';
import { withJsonFormsControlProps } from '@jsonforms/react';
import merge from 'lodash/merge';

import { WeightedRow } from '#shared/components/FormFields/WeighedRow';

export const RowControl = ({
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
  if (!visible) {
    return null;
  }

  return (
    <WeightedRow
      label={label}
      value={data}
      handleChange={(val) => handleChange(path, val ?? '')}
      name={id}
      disabled={!enabled}
      errors={errors.length > 0 ? errors.split('\n') : undefined}
      required={required}
      helperText={description}
      cols={schema.properties?.value?.oneOf?.map((val) => val.title) || []}
      weighted={appliedUiSchemaOptions.weighted ?? true}
    />
  );
};

export const rowControlTester: RankedTester = rankWith(
  100,
  and(isObjectControl, optionIs('row', true)),
);
export default withJsonFormsControlProps(RowControl);
