import { memo } from 'react';

import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useTranslation } from '#shared/i18n/useTranslation';

type DateFieldProps = Omit<DatePickerProps, 'error'> & {
  name?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  errors?: string[];
  fullWidth?: boolean;
};

function DateFieldComponent({
  errors,
  name,
  label,
  helperText,
  required,
  fullWidth = false,
  ...props
}: DateFieldProps) {
  const { dateFnsLocale } = useTranslation();
  const isError = errors !== undefined;

  return (
    <LocalizationProvider
      adapterLocale={dateFnsLocale}
      dateAdapter={AdapterDateFns}
    >
      <DatePicker
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

export const DateField = memo(DateFieldComponent);
