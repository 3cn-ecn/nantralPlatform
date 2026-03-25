import { useEffect, useState } from 'react';

import { $RefParser } from '@apidevtools/json-schema-ref-parser';
import {
  ControlProps,
  JsonSchema,
  rankWith,
  scopeEndsWith,
} from '@jsonforms/core';
import { WithOptionLabel } from '@jsonforms/material-renderers';
import { TranslateProps, withJsonFormsControlProps } from '@jsonforms/react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

function AnyOfControl({
  data,
  handleChange,
  path,
  ...props
}: ControlProps & WithOptionLabel & TranslateProps & { schema: JsonSchema[] }) {
  const [children, setChildren] = useState<JsonSchema[]>([]);
  useEffect(() => {
    setChildren([]);
    props.schema.map((child) =>
      $RefParser
        .resolve(props.rootSchema)
        .then(($refs) => $refs.get(child.$ref ?? '/'))
        .then((childSchema) => {
          setChildren((prev) => {
            const title = (child.$ref ?? '/').split('/').at(-1);
            return [
              ...prev.filter((e) => e.title !== title),
              { title, schema: childSchema },
            ];
          });
        }),
    );
  }, [props.rootSchema, props.schema]);
  return (
    <div>
      <FormControl sx={{ my: 1 }} fullWidth>
        <InputLabel id={props.id}>{props.label}</InputLabel>
        <Select
          variant={'outlined'}
          onChange={(val) => handleChange(path, val.target.value)}
          label={props.label}
          labelId={props.id}
          value={data}
        >
          {children.map((child) => (
            <MenuItem key={child.title} value={child.title}>
              {child.title}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{props.description}</FormHelperText>
      </FormControl>
    </div>
  );
}

export const AnyOfTester = rankWith(
  3, //increase rank as needed
  scopeEndsWith('anyOf'),
);

export default withJsonFormsControlProps(AnyOfControl);
