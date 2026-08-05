import { ReactNode, useEffect } from 'react';

import {
  FormHelperText,
  MenuItem,
  Radio,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import { SelectField } from '#shared/components/FormFields/SelectField';
import { useTranslation } from '#shared/i18n/useTranslation';

export type WeightedValue = {
  weight?: number;
  value?: number;
} | null;

interface WeighedRowProps {
  label: string;
  name: string;
  helperText?: ReactNode;
  cols: string[];
  value?: WeightedValue;
  handleChange: (val: WeightedValue) => void;
  weighted?: boolean;
  disabled?: boolean;
  errors?: string[];
  required?: boolean;
}

export function WeightedRow({
  label,
  name,
  helperText,
  cols,
  handleChange,
  value,
  weighted,
  disabled,
  errors,
}: WeighedRowProps) {
  const { t } = useTranslation();
  const isError = errors !== undefined;

  useEffect(() => {
    if (weighted && value?.weight === undefined) {
      handleChange({ ...value, weight: 1 });
    }
  }, [handleChange, value, weighted]);

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell>
        <Typography color={disabled ? 'textDisabled' : undefined}>
          {label}
        </Typography>
        <FormHelperText sx={{ mt: 0 }} error={isError}>
          {isError ? errors.join(', ') : helperText}
        </FormHelperText>
      </TableCell>
      {cols.map((val, i) => (
        <TableCell key={val} sx={{ textAlign: 'center' }}>
          <Tooltip title={val} placement={'right'}>
            <Radio
              name={name}
              checked={value?.value === i}
              onChange={() => handleChange({ ...value, value: i })}
              slotProps={{ input: { 'aria-label': label + ' : ' + val } }}
              value={val}
              disabled={disabled}
            />
          </Tooltip>
        </TableCell>
      ))}
      {weighted && (
        <TableCell>
          <SelectField
            handleChange={(weight) =>
              handleChange({
                ...(value as WeightedValue),
                weight: parseInt(weight),
              })
            }
            aria-label={t('form.weighted.weight.label')}
            value={value?.weight?.toString() ?? '1'}
            size={'small'}
            margin={'none'}
            disabled={disabled}
          >
            <MenuItem value={'0'}>
              {t('form.weighted.weight.unsignificant')}
            </MenuItem>
            <MenuItem value={'1'}>{t('form.weighted.weight.low')}</MenuItem>
            <MenuItem value={'2'}>{t('form.weighted.weight.medium')}</MenuItem>
            <MenuItem value={'3'}>{t('form.weighted.weight.high')}</MenuItem>
          </SelectField>
        </TableCell>
      )}
    </TableRow>
  );
}
