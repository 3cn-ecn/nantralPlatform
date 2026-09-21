import { memo, useCallback, useMemo, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { TextField, TextFieldProps } from '#shared/components/FormFields/index';
import { useTranslation } from '#shared/i18n/useTranslation';

export type NumberFieldProps = Omit<
  TextFieldProps,
  'value' | 'handleChange'
> & {
  value: number | null;
  handleChange: (value: number | null) => void;
  type?: 'numeric' | 'decimal';
  step?: number;
  minimum?: number;
  maximum?: number;
};

function NumberFieldComponent({
  errors,
  handleChange,
  step,
  type = 'numeric',
  size = 'medium',
  value,
  minimum,
  maximum,
  ...props
}: NumberFieldProps) {
  const [stringValue, setStringValue] = useState(value?.toString() || '');
  const { t } = useTranslation();

  const parseNumber = type === 'numeric' ? parseInt : parseFloat;

  const handleTextChange = useCallback(
    (val: string) => {
      val = val.replace(',', '.');
      setStringValue(val);
      if (val === '') {
        return handleChange(null);
      }
      if (isFinite(parseNumber(val))) {
        handleChange(parseNumber(val));
      }
    },
    [handleChange, parseNumber],
  );

  const allErrors = useMemo(
    () =>
      (value?.toString() || '') !== stringValue
        ? [t('form.number.wrongFormat'), ...(errors ?? [])]
        : errors,
    [errors, stringValue, t, value],
  );

  if (minimum !== undefined && maximum !== undefined && maximum < minimum) {
    throw new Error('Maximum value cannot be less than minimum value');
  }

  return (
    <TextField
      value={stringValue}
      handleChange={handleTextChange}
      errors={allErrors}
      type={type}
      slotProps={{
        ...props.slotProps,
        htmlInput: {
          ...props.slotProps?.htmlInput,
          step,
          min: minimum,
          max: maximum,
        },
        input: {
          ...props.slotProps?.input,
          sx: { pr: 0 },
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                flexDirection: 'column',
                maxHeight: 'unset',
                alignSelf: 'stretch',
                borderLeft: '1px solid',
                borderColor: 'divider',
                ml: 0,
                '& button': {
                  py: 0,
                  flex: 1,
                  borderRadius: 0.5,
                },
              }}
            >
              <IconButton
                size={size}
                aria-label="Increase"
                onClick={useCallback(() => {
                  let newVal = (value ?? 0) + (step ?? 1);
                  if (maximum !== undefined) {
                    newVal = Math.min(newVal, maximum);
                  }
                  handleChange(newVal);
                  setStringValue(newVal.toString());
                }, [handleChange, maximum, step, value])}
              >
                <KeyboardArrowUpIcon
                  fontSize={size}
                  sx={{ transform: 'translateY(2px)' }}
                />
              </IconButton>

              <IconButton
                size={size}
                aria-label="Decrease"
                onClick={useCallback(() => {
                  let newVal = (value ?? 0) - (step ?? 1);
                  if (minimum !== undefined) {
                    newVal = Math.max(newVal, minimum);
                  }
                  handleChange(newVal);
                  setStringValue(newVal.toString());
                }, [handleChange, minimum, step, value])}
              >
                <KeyboardArrowDownIcon
                  fontSize={size}
                  sx={{ transform: 'translateY(-2px)' }}
                />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
    />
  );
}

export const NumberField = memo(NumberFieldComponent);
