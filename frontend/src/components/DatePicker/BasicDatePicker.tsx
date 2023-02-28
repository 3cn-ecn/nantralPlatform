import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';
import 'dayjs/locale/en';
import TextField from '@mui/material/TextField';
import './BasicDatePicker.scss';
import { IconButton, InputAdornment } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function BasicDatePicker(props: {
  label: string;
  minDate: any;
  getDate: any;
}) {
  const { t } = useTranslation('translation'); // translation module
  const { i18n } = useTranslation('translation');
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const [isEmpty, setIsEmpty] = React.useState(true);
  const { label, minDate, getDate } = props;

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (newValue === null) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };

  const clearDate = () => {
    setValue(null);
    getDate(null);
    setIsEmpty(true);
  };

  /**
   * Function used to render DesktopDatePicker
   * @param params params of DesktopDatePicker
   * @param empty boolean : true if picker is empty
   * @returns the input rendered
   */
  const render = (params: any, empty: boolean) => {
    // if picker is not empty, display a clear button
    if (empty === false) {
      return (
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
      );
    }
    return (
      <TextField className="textfield" size="small" {...params}></TextField>
    );
  };
  console.log(value);
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language.substring(0, 2)}
    >
      <DesktopDatePicker
        minDate={minDate}
        inputFormat="DD/MM/YYYY"
        label={label}
        value={value}
        onChange={handleChange}
        showDaysOutsideCurrentMonth
        renderInput={(params) => render(params, isEmpty)}
      />
    </LocalizationProvider>
  );
}
