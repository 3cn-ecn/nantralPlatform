import { memo } from 'react';

import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Locale } from 'date-fns';
import { enGB, fr } from 'date-fns/locale';

import { languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';

const mapLanguages: Record<(typeof languages)[number], Locale> = {
  'fr-FR': fr,
  'en-GB': enGB,
};

type DateTimeFieldProps = Omit<DateTimePickerProps<Date>, 'error'> & {
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
  const { i18n } = useTranslation();
  const isError = errors !== undefined;

  return (
    <LocalizationProvider
      adapterLocale={mapLanguages[i18n.language]}
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
