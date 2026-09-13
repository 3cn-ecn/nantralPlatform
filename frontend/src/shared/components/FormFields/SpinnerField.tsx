import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  FormControlProps,
  FormHelperText,
  OutlinedInputProps,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

import { NumberFieldProps } from '#shared/components/FormFields/NumberField';
import { useTranslation } from '#shared/i18n/useTranslation';

type SpinnerFieldProps = Omit<
  FormControlProps,
  'value' | 'onChange' | 'error'
> &
  Pick<
    NumberFieldProps,
    | 'value'
    | 'helperText'
    | 'handleChange'
    | 'type'
    | 'step'
    | 'errors'
    | 'label'
    | 'maximum'
    | 'minimum'
  > & {
    slotProps?: OutlinedInputProps['slotProps'];
  };

export function SpinnerField({
  id: idProp,
  value,
  handleChange,
  type = 'numeric',
  size,
  errors,
  label,
  step,
  helperText,
  slotProps,
  maximum,
  minimum,
  ...props
}: SpinnerFieldProps) {
  let id = React.useId();
  if (idProp) {
    id = idProp;
  }

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

  const hasErrors = useMemo(
    () => allErrors && allErrors?.length > 0,
    [allErrors],
  );

  if (minimum !== undefined && maximum !== undefined && maximum < minimum) {
    throw new Error('Maximum value cannot be less than minimum value');
  }

  return (
    <FormControl
      size={size}
      variant="outlined"
      sx={{
        '& .MuiButton-root': {
          borderColor: 'divider',
          minWidth: 0,
          bgcolor: 'action.hover',
          '&:not(.Mui-disabled)': {
            color: 'text.primary',
          },
        },
      }}
      {...props}
    >
      <Box component="span" sx={{ userSelect: 'none', width: 'max-content' }}>
        <FormLabel
          htmlFor={id}
          sx={{
            display: 'inline-block',
            cursor: 'ew-resize',
            fontSize: '0.875rem',
            color: 'text.primary',
            fontWeight: 500,
            lineHeight: 1.5,
            mb: 0.5,
          }}
        >
          {label}
        </FormLabel>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Button
          variant="outlined"
          aria-label="Decrease"
          size={size}
          sx={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: '0px',
            '&.Mui-disabled': {
              borderRight: '0px',
            },
          }}
          onClick={useCallback(() => {
            let newVal = (value ?? 0) - (step ?? 1);
            if (minimum !== undefined) {
              newVal = Math.max(newVal, minimum);
            }
            handleChange(newVal);
            setStringValue(newVal.toString());
          }, [handleChange, minimum, step, value])}
        >
          <RemoveIcon fontSize={size} />
        </Button>

        <OutlinedInput
          id={id}
          onChange={(e) => handleTextChange(e.target.value)}
          value={stringValue}
          error={hasErrors}
          type={type}
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps?.input,
              step,
              min: minimum,
              max: maximum,
              size:
                Math.max(
                  (step?.toString() || '').length,
                  (minimum?.toString() || '').length,
                  stringValue.length || 1,
                ) + 1,
              sx: {
                textAlign: 'center',
              },
            },
          }}
          sx={{ pr: 0, borderRadius: 0, flex: 1 }}
        />

        <Button
          variant="outlined"
          aria-label="Increase"
          size={size}
          color={hasErrors ? 'error' : 'primary'}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeft: '0px',
            '&.Mui-disabled': {
              borderLeft: '0px',
            },
          }}
          onClick={useCallback(() => {
            let newVal = (value ?? 0) + (step ?? 1);
            if (maximum !== undefined) {
              newVal = Math.min(newVal, maximum);
            }
            handleChange(newVal);
            setStringValue(newVal.toString());
          }, [handleChange, maximum, step, value])}
        >
          <AddIcon fontSize={size} />
        </Button>
      </Box>
      <FormHelperText error={hasErrors}>
        {hasErrors ? allErrors?.join(', ') : helperText}
      </FormHelperText>
    </FormControl>
  );
}
