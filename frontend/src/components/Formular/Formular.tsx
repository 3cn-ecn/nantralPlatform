import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/fr';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import IconButton from '@mui/material/IconButton';

// A modifier en mettant les groupes de la personne
const groups = [
  { label: 'Mon Super Club 1', value: 'Mon Super Club 1' },
  { label: 'Mon Super Club 2', value: 'Mon' },
  { label: 'Ma Super Coloc', value: 'Ma' },
];

function ChoiceGroup() {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl required sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-required-label">Groupe</InputLabel>
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        value={age}
        label="Groupe *"
        onChange={handleChange}
      >
        {groups.map((option) => (
          <MenuItem value={option.label} key={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        Vous devez être admin pour créer un événement
      </FormHelperText>
    </FormControl>
  );
}

function ChoiceStatus() {
  const [status, setStatus] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">Statut de l&apos;événement</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={status}
        label="Statut de l'événement"
        onChange={handleChange}
        style={{ width: 200 }}
      >
        <MenuItem value={1}>Evenement Public</MenuItem>
        <MenuItem value={2}>Evenement Privé</MenuItem>
      </Select>
    </FormControl>
  );
}

function ChoiceBegin() {
  const [valueDebut, setValue] = React.useState<Dayjs | null>(null);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <DateTimePicker
        label="Date et Heure de début"
        value={valueDebut}
        onChange={handleChange}
        disablePast
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

function ChoiceEnd() {
  const [valueEnd, setValueEnd] = React.useState<Dayjs | null>(null);

  const handleChangeEnd = (newValue: Dayjs | null) => {
    setValueEnd(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <DateTimePicker
        label="Date et Heure de fin"
        value={valueEnd}
        onChange={handleChangeEnd}
        disablePast
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

function UploadImage() {
  return (
    <IconButton color="primary" aria-label="upload picture" component="label">
      <input hidden accept="image/*" type="file" />
      <AddPhotoAlternateIcon />
    </IconButton>
  );
}

function ChoiceTitle() {
  return (
    <TextField
      required
      id="Title"
      label="Titre de l'événement"
      color="primary"
      margin="dense"
      style={{ width: 400 }}
    />
  );
}

function Description() {
  return (
    <TextField
      required
      id="Title"
      label="Description"
      color="primary"
      margin="dense"
      style={{ width: 760 }}
      multiline
      rows={5}
    />
  );
}

function ChoicePlace() {
  return (
    <TextField
      required
      id="Lieu"
      label="Lieu de l'événement"
      color="primary"
      margin="dense"
      style={{ width: 208 }}
      // multiline
      fullWidth
    />
  );
}

function ValidationButton() {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={() => {
        console.log(document.getElementById('test'));
      }}
    >
      Validation de l&apos;événement
    </Button>
  );
}

function Form() {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <FirstLine />
      <SecondLine />
      <Description />
      <LastLine />
    </Box>
  );
}


function FirstLine() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <ChoiceGroup />
        </Grid>
        <Grid item xs="auto">
          <ChoiceTitle />
        </Grid>
      </Grid>
    </Box>
  );
}

function SecondLine() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <ChoiceBegin />
        </Grid>
        <Grid item xs="auto">
          <ChoiceEnd />
        </Grid>
        <Grid item xs="auto">
          <ChoicePlace />
        </Grid>
      </Grid>
    </Box>
  );
}

function LastLine() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <ChoiceStatus />
        </Grid>
        <Grid item xs="auto">
          <UploadImage />
        </Grid>
        <Grid item xs={8}>
          <ValidationButton />
        </Grid>
      </Grid>
    </Box>
  );
}

function Formular() {
  return (
    <>
      <h2>Formulaire de création d&apos;un événement</h2>
      <Form />
    </>
  );
}

export default Formular;
