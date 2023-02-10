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
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Formular.css';
import Typography from '@mui/material/Typography';

// A modifier en mettant les groupes de la personne
const groups = [
  { label: 'Mon Super Club 1', value: 'Mon Super Club 1' },
  { label: 'Mon Super Club 2', value: 'Mon' },
  { label: 'Ma Super Coloc', value: 'Ma' },
];

function ChoiceGroup() {
  const [group, setGroup] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value);
  };

  return (
    <FormControl required sx={{ m: 1, minWidth: 200 }}>
      <InputLabel id="demo-simple-select-required-label">Groupe</InputLabel>
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        value={group}
        label="Groupe *"
        onChange={handleChange}
        style={{ display: 'flex', width: '100%' }}
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
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <InputLabel id="demo-select-small">Statut de l&apos;événement</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={status}
        label="Statut de l'événement *"
        onChange={handleChange}
        style={{ display: 'flex', width: '100%' }}
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
        label="Date et Heure de début *"
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
        label="Date et Heure de fin *"
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
      fullWidth
      style={{ display: 'flex', width: '100%' }}
      // /* style={{ width: 400 }} */
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
      fullWidth
      // /* style={{ width: 745 }} */
      style={{ display: 'flex', width: '100%' }}
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
      style={{ display: 'flex', width: '100%' }}
      fullWidth
    />
  );
}

function DeadlineInscription() {
  const [valueDebut, setValue] = React.useState<Dayjs | null>(null);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <DateTimePicker
        label="Fin Inscriptions"
        value={valueDebut}
        onChange={handleChange}
        disablePast
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

function FirstLine() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <ChoiceGroup />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ChoiceTitle />
        </Grid>
      </Grid>
    </Box>
  );
}

function SecondLine() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4}>
          <ChoiceBegin />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ChoiceEnd />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <ChoicePlace />
        </Grid>
      </Grid>
    </Box>
  );
}

function Shotgun() {
  const [valueDebut, setValue] = React.useState<Dayjs | null>(null);

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const [checkShotgun, setCheckShotgun] = React.useState(false);
  const [checkForm, setCheckForm] = React.useState(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs="auto" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={checkShotgun}
                  onChange={() => setCheckShotgun(!checkShotgun)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              labelPlacement="start"
              label="Shotgun"
            />
          </Grid>
          <Grid item xs="auto" alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
              <DateTimePicker
                label="Début Shotgun*"
                value={valueDebut}
                onChange={handleChange}
                disablePast
                renderInput={(params) => <TextField {...params} />}
                disabled={!checkShotgun}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={checkForm}
                  onChange={() => setCheckForm(!checkForm)}
                  inputProps={{ 'aria-label': 'controlled' }}
                  disabled={!checkShotgun}
                />
              }
              labelPlacement="start"
              label="Formulaire"
            />
          </Grid>
          <Grid item xs={12} sm={5} alignItems="center">
            <TextField
              required
              id="URL"
              label="Lien Formulaire Shotgun"
              color="primary"
              margin="dense"
              fullWidth
              style={{ display: 'flex', width: '100%' }}
              disabled={!checkForm}
            />
          </Grid>
          <Grid item xs={12} sm={4} alignItems="center">
            <TextField
              required
              id="MaxParticipants"
              label="Nombre Max de Participants"
              color="primary"
              margin="dense"
              style={{ display: 'flex', width: '100%' }}
              fullWidth
              disabled={!checkShotgun || checkForm}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs zeroMinWidth alignItems="center">
            <Typography style={{ overflowWrap: 'break-word' }}>
              {' '}
              Si vous décidez de faire un shotgun vous pouvez au choix, soit
              mettre le lien d&apos;un form, soit définir un nombre max de
              participants
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function LastLine() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs="auto" alignItems="center">
          <DeadlineInscription />
        </Grid>
        <Grid item xs="auto" alignItems="center">
          <ChoiceStatus />
        </Grid>
        <Grid item xs="auto" alignItems="center">
          <UploadImage />
        </Grid>
      </Grid>
    </Box>
  );
}

function Formular() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Créer un événement
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="responsive-dialog-title">
          Formulaire pour la création d&apos;un événement
        </DialogTitle>
        <DialogContent>
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
            <Shotgun />
            <LastLine />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Validation de l&apos;événement
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Formular;
