import { useMemo } from 'react';

import {
  and,
  composePaths,
  ControlProps,
  isAllOfControl,
  JsonSchema,
  optionIs,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { WithInput } from '@jsonforms/material-renderers';
import {
  JsonFormsDispatch,
  TranslateProps,
  withJsonFormsControlProps,
  withTranslateProps,
} from '@jsonforms/react';
import {
  FormHelperText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import merge from 'lodash/merge';

import { useTranslation } from '#shared/i18n/useTranslation';

export const TableControl = ({
  description,
  label,
  uischema,
  visible,
  config,
  schema,
  renderers,
  cells,
  path,
  i18nKeyPrefix,
  t: jsonFormTranslator,
}: ControlProps & WithInput & TranslateProps) => {
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  const weighted = appliedUiSchemaOptions.weighted ?? true;
  const { t } = useTranslation();

  const rows = useMemo(
    () => Object.entries(schema.allOf?.[0]?.properties || {}),
    [schema.allOf],
  );

  // Get the value schema: allOf[1].patternProperties['^.*$'], which should be the first and only key
  const valueSchema = useMemo(
    () => Object.entries(schema.allOf?.[1]?.patternProperties || {})[0]?.[1],
    [schema.allOf],
  );

  if (!visible) {
    return null;
  }

  // Extract column headers from value schema's properties
  const valueColumns = valueSchema?.properties?.value?.oneOf as
    JsonSchema[] | undefined;

  return (
    <TableContainer component={Paper} sx={{ my: 1 }}>
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell>
              {label}
              <FormHelperText>{description}</FormHelperText>
            </TableCell>
            {valueColumns?.map((val: JsonSchema) => (
              <TableCell key={val.const} sx={{ textAlign: 'center' }}>
                {jsonFormTranslator(i18nKeyPrefix + '.' + val.const + '.label')}
                <FormHelperText>
                  {jsonFormTranslator(
                    i18nKeyPrefix + '.' + val.const + '.description',
                  )}
                </FormHelperText>
              </TableCell>
            ))}
            {weighted && (
              <TableCell>{t('form.weighted.weight.label')}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([name, row]) => (
            <JsonFormsDispatch
              key={name}
              visible={visible}
              uischema={{
                type: 'Control',
                scope: '#/',
                options: {
                  row: true,
                },
              }}
              path={composePaths(path, name)}
              schema={{
                ...valueSchema,
                ...row,
              }}
              renderers={renderers}
              cells={cells}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const tableControlTester: RankedTester = rankWith(
  100,
  and(isAllOfControl, optionIs('table', true)),
);
export default withJsonFormsControlProps(withTranslateProps(TableControl));
