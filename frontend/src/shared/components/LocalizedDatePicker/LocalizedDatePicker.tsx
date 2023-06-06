import React, { useState } from 'react';

import { Cancel as CancelIcon } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB as enGBDateLocale, fr as frDateLocale } from 'date-fns/locale';

import { useTranslation } from '#shared/i18n/useTranslation';

const locales = { 'fr-FR': frDateLocale, 'en-GB': enGBDateLocale };

type LocalizedDatePickerProps = DesktopDatePickerProps<Date> & {
  showClearButton?: boolean;
};

export default function LocalizedDatePicker({
  showClearButton = true,
  onChange,
  ...props
}: LocalizedDatePickerProps) {
  const { i18n } = useTranslation();
  const [isEmpty, setIsEmpty] = useState(true);

  const handleChange: LocalizedDatePickerProps['onChange'] = (
    value,
    context
  ) => {
    onChange(value, context);
    if (value === null) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };

  const clearDate = () => {
    onChange(null, null);
    setIsEmpty(true);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={locales[i18n.language]}
    >
      <DesktopDatePicker
        onChange={handleChange}
        showDaysOutsideCurrentMonth
        slotProps={{
          textField: (textFieldProps) => {
            console.log('here', isEmpty, showClearButton);
            return (
              <TextField
                sx={{ float: 'left', padding: '-100px' }}
                size="small"
                {...textFieldProps}
                InputProps={{
                  ...textFieldProps.InputProps,
                  endAdornment: (
                    <>
                      {!isEmpty && showClearButton && (
                        <InputAdornment sx={{ margin: '-12px' }} position="end">
                          <IconButton
                            sx={{ padding: '-15px' }}
                            size="small"
                            onClick={clearDate}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )}
                      {textFieldProps.InputProps.endAdornment}
                    </>
                  ),
                }}
              ></TextField>
            );
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
}
