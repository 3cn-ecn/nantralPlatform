import { useCallback, useMemo, useState } from 'react';

import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

import {
  TextField,
  TextFieldProps,
} from '#shared/components/FormFields/TextField';
import { useTranslation } from '#shared/i18n/useTranslation';

type NumberFieldProps = Omit<TextFieldProps, 'handleChange' | 'value'> & {
  value: number | null;
  handleChange: (value: number | null) => void;
};

export function ButtonNumberField({
  value,
  handleChange,
  errors,
  ...props
}: NumberFieldProps) {
  const [stringValue, setStringValue] = useState(value?.toString() || '');
  const { t } = useTranslation();

  const handleTextChange = useCallback(
    (val: string) => {
      setStringValue(val);
      if (val === '') {
        return handleChange(null);
      }
      if (isFinite(parseInt(val))) {
        handleChange(parseInt(val));
      }
    },
    [handleChange],
  );

  const allErrors = useMemo(
    () =>
      (value?.toString() || '') !== stringValue
        ? [t('form.number.wrongFormat'), ...(errors ?? [])]
        : errors,
    [errors, stringValue, t, value],
  );

  return (
    <TextField
      value={stringValue}
      handleChange={handleTextChange}
      errors={allErrors}
      type="numeric"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={() =>
                handleTextChange(value === null ? '' : (value - 1).toString())
              }
              disabled={(value || -1) <= 0}
            >
              <RemoveIcon />
            </IconButton>
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() =>
                handleTextChange(value === null ? '1' : (value + 1).toString())
              }
            >
              <AddIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
