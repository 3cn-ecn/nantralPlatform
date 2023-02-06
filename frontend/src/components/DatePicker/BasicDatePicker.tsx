import * as React from 'react';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/fr';
import TextField from '@mui/material/TextField';

export default function BasicDatePicker(props: { label: string }) {
  const [valueDebut, setValue] = React.useState<Dayjs | null>(null);
  const { label } = props;

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <DatePicker
        label={label}
        value={valueDebut}
        onChange={handleChange}
        disablePast
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
