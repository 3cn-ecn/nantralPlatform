import { useMemo } from 'react';

import {
  and,
  ControlProps,
  isObjectControl,
  optionIs,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { WithInput } from '@jsonforms/material-renderers';
import { useJsonForms, withJsonFormsControlProps } from '@jsonforms/react';
import { union, merge } from 'lodash';

import { WeightedRow } from '#shared/components/FormFields/WeighedRow';

export const RowControl = ({
  id,
  description,
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

  const form = useJsonForms();
  const formErrors = useMemo(
    () =>
      union(
        form.core?.additionalErrors,
        form.core?.validationMode === 'ValidateAndShow'
          ? form.core?.errors
          : [],
      )
        .filter((err) =>
          err.instancePath.startsWith('/' + path.replaceAll('.', '/')),
        )
        .map((err) => err.message)
        .filter((err) => err !== undefined),
    [
      form.core?.additionalErrors,
      form.core?.errors,
      form.core?.validationMode,
      path,
    ],
  );

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
      errors={formErrors.length > 0 ? formErrors : undefined}
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
