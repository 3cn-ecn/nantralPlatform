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
  getDate: any;
  controlledValue: Dayjs | null;
}) {
  const { label, minDate, getDate, controlledValue } = props;
  const { t } = useTranslation('translation'); // translation module
  const { i18n } = useTranslation('translation');
  const [value, setValue] = React.useState<Dayjs | null>(null); // value selected
  const [isEmpty, setIsEmpty] = React.useState(true); // true if not date is selected

  React.useEffect(() => {
    setValue(value);
  }, [controlledValue]);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    getDate(newValue);
    if (newValue === null) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  };

  // function used to clear date. Only possible when value is not null
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
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.language.substring(0, 2)} // TO CHANGE: when en-GB and fr_FR are supported, delete substring
    >
      <DesktopDatePicker
        minDate={minDate}
        inputFormat="DD/MM/YYYY" // TO CHANGE : when en-GB is supported, delete this line
        label={label}
        value={value}
        onChange={handleChange}
        showDaysOutsideCurrentMonth
        textfield={(params) => render(params, isEmpty)}
      />
    </LocalizationProvider>
  );
}
