import * as React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/fr';
import TextField from '@mui/material/TextField';

// TO DO : UN BOUTON POUR ENLEVER LA DATE CHOISIE

export default function BasicDatePicker(props: {
  label: string;
  minDate: any;
  getDate: any;
}) {
  const [valueDebut, setValue] = React.useState<Dayjs | null>(null);
  const { label, minDate, getDate } = props;

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    getDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <DatePicker
        minDate={minDate}
        label={label}
        value={valueDebut}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
