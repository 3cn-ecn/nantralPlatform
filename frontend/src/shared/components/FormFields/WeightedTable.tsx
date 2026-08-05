import { ReactNode } from 'react';

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

import {
  WeightedRow,
  WeightedValue,
} from '#shared/components/FormFields/WeighedRow';
import { useTranslation } from '#shared/i18n/useTranslation';

interface LabelType {
  label: string;
  helperText?: ReactNode;
}

interface WeightedTableProps<T extends string> {
  cols: LabelType[];
  rows: Record<T, LabelType>;
  label?: string;
  helperText?: ReactNode;
  values?: Record<T, WeightedValue>;
  weighted?: boolean;
  handleChange: (name: T, val: WeightedValue) => void;
}

export function WeightedTable<T extends string>({
  label,
  helperText,
  cols,
  rows,
  weighted,
  handleChange,
  values,
}: WeightedTableProps<T>) {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell>
              {label}
              <FormHelperText>{helperText}</FormHelperText>
            </TableCell>
            {cols.map((val) => (
              <TableCell key={val.label} sx={{ textAlign: 'center' }}>
                {val.label}
                <FormHelperText>{val.helperText}</FormHelperText>
              </TableCell>
            ))}
            {weighted && (
              <TableCell>{t('form.weighted.weight.label')}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(rows).map(([name, row]: [T, LabelType]) => (
            <WeightedRow
              key={name}
              label={row.label}
              helperText={row.helperText}
              name={name}
              cols={cols.map((c) => c.label)}
              value={values?.[name]}
              handleChange={(val) => handleChange(name, val)}
              weighted={weighted}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
