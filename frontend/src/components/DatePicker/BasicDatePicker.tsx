import React from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import { IconButton, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';

import { useTranslation } from '#i18n/useTranslation';

import './BasicDatePicker.scss';

/**
 * Function to display a basic clearable Desktop DatePicker
 * @param props label: text displayed inside TextView,
 *              minDate: prevent from choosing a date before minDate,
 *              getDate: function used to get date value back to parent component
 * @returns the DatePicker
 */
export default function BasicDatePicker(props: {
  label: string;
  minDate: any;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}) {
  const { label, minDate, value, onChange } = props;
  const { t } = useTranslation(); // translation module
  const { i18n } = useTranslation();
  const [isEmpty, setIsEmpty] = React.useState(true); // true if not date is selected

  // React.useEffect(() => {
  //   setValue(value);
  // }, [controlledValue]);

  const handleChange = (newValue: Dayjs | null) => {
    onChange(newValue);
    if (newValue === null) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };

  // function used to clear date. Only possible when value is not null
  const clearDate = () => {
    onChange(null);
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
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language.substring(0, 2)} // TO CHANGE: when en-GB and fr_FR are supported, delete substring
    >
      <DesktopDatePicker
        minDate={dayjs(minDate)}
        // inputFormat="DD/MM/YYYY" // TO CHANGE : when en-GB is supported, delete this line
        label={label}
        value={value}
        onChange={handleChange}
        showDaysOutsideCurrentMonth
        slotProps={{ textField: (params) => render(params, isEmpty) }}
      />
    </LocalizationProvider>
  );
}
