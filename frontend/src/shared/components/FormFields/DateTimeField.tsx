import { memo } from 'react';

import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useTranslation } from '#shared/i18n/useTranslation';

type DateTimeFieldProps = Omit<DateTimePickerProps, 'error'> & {
  name?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  errors?: string[];
  fullWidth?: boolean;
};

function DateTimeFieldComponent({
  errors,
  name,
  label,
  helperText,
  required,
  fullWidth = false,
  ...props
}: DateTimeFieldProps) {
  const { dateFnsLocale } = useTranslation();
  const isError = errors !== undefined;

  return (
    <LocalizationProvider
      adapterLocale={dateFnsLocale}
      dateAdapter={AdapterDateFns}
    >
      <DateTimePicker
        {...props}
        slotProps={{
          ...props.slotProps,
          textField: {
            name: name,
            label: label,
            fullWidth: fullWidth,
            required: required,
            helperText: isError ? errors.join(', ') : helperText,
            error: isError,
            margin: 'normal',
            ...props.slotProps?.textField,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export const DateTimeField = memo(DateTimeFieldComponent);
