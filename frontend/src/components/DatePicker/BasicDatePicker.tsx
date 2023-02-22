import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import './BasicDatePicker.scss';
import { IconButton, InputAdornment } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// TO DO : UN BOUTON POUR ENLEVER LA DATE CHOISIE
export default function BasicDatePicker(props: {
  label: string;
  minDate: any;
  getDate: any;
}) {
  const { t } = useTranslation('translation'); // translation module
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const { label, minDate, getDate } = props;

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    getDate(newValue);
  };

  const clearDate = () => {
    setValue(null);
    getDate(null);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={t('date_picker.language')}
    >
      <DesktopDatePicker
        minDate={minDate}
        label={label}
        value={value}
        onChange={handleChange}
        showDaysOutsideCurrentMonth
        renderInput={(params) => (
          <TextField
            className="textfield"
            size="small"
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <InputAdornment className="adornment" position="end">
                    <IconButton
                      className="button"
                      size="small"
                      onClick={clearDate}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          ></TextField>
        )}
      />
    </LocalizationProvider>
  );
}
