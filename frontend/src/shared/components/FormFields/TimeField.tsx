import { memo } from 'react';

import {
  LocalizationProvider,
  TimePicker,
  TimePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';

import { useTranslation } from '#shared/i18n/useTranslation';

type TimeFieldProps = Omit<TimePickerProps, 'error'> & {
  name?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  errors?: string[];
  fullWidth?: boolean;
};

function TimeFieldComponent({
  errors,
  name,
  label,
  helperText,
  required,
  fullWidth = false,
  ...props
}: TimeFieldProps) {
  const { dateFnsLocale } = useTranslation();
  const isError = errors !== undefined;

  return (
    <LocalizationProvider
      adapterLocale={dateFnsLocale}
      dateAdapter={AdapterDateFns}
    >
      <TimePicker
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

export const TimeField = memo(TimeFieldComponent);
