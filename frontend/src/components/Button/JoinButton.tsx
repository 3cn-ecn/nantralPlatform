import {
  PeopleAlt as PeopleIcon,
  AddCircle as PlusIcon,
  CheckCircle as CheckIcon,
  LinkOutlined as LinkIcon,
  LocalFireDepartment as ShotgunIcon,
  Cancel as Cross,
} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Theme,
  SxProps,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CapitalizeFirstLetter } from '../../utils/formatText';

interface JoinButtonProps {
  variant?: 'shotgun' | 'normal' | 'form';
  link?: string;
  maxPerson?: number;
  shotgunClosed?: boolean;
  person: number;
  sx?: SxProps<Theme>;
  participating: boolean;
  eventSlug: string;
}

function JoinButton({
  variant,
  link,
  maxPerson,
  person,
  shotgunClosed,
  sx,
  participating,
  eventSlug,
}: JoinButtonProps): JSX.Element {
  const [selected, setSelected] = React.useState(participating);
  const [people, setPeople] = React.useState(person);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { t } = useTranslation('translation');

  const participate = async () => {
    axios
      .post(`api/event/${eventSlug}/participate`)
      .then((res) => {
        if (res.data.success) {
          setPeople(people + 1);
          setSelected(true);
        } else {
          console.error('could not subscribe to event');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const quit = async () => {
    axios
      .delete(`api/event/${eventSlug}/participate`)
      .then((res) => {
        if (res.data.success) {
          setSelected(false);
          setPeople(people - 1);
        } else {
          console.error('could not unsuscribe from event');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleClose = (unsuscribe: boolean) => {
    setOpen(false);
    if (unsuscribe) {
      setLoading(true);
      quit();
    }
  };
  const onClick = () => {
    switch (variant) {
      case 'normal':
        if (selected) {
          setOpen(true);
        } else {
          setLoading(true);
          participate();
        }
        break;
      case 'shotgun':
        if ((person >= maxPerson || shotgunClosed) && !selected) return;
        if (selected) {
          setOpen(true);
        } else {
          setLoading(true);
          participate();
        }
        break;
      case 'form':
        window.open(link, '_blank');
        break;
      default:
    }
  };

  const getFirstIcon = () => {
    switch (variant) {
      case 'shotgun':
        return <ShotgunIcon />;
      case 'form':
        return <LinkIcon />;
      default:
        return <PeopleIcon />;
    }
  };
  const getSecondIcon = () => {
    if (variant === 'normal') return selected ? <CheckIcon /> : <PlusIcon />;
    if (variant === 'shotgun') {
      if ((person >= maxPerson || shotgunClosed) && !selected) return <Cross />;
      if (selected) return <CheckIcon />;
      return selected ? <CheckIcon /> : <PlusIcon />;
    }
    return null;
  };
  const getText = () => {
    switch (variant) {
      case 'normal':
        return people;
      case 'shotgun':
        return `${people}/${maxPerson}`;
      case 'form':
        return t('button.joinButton.register');
      default:
        return people;
    }
  };
  let title: string;
  if (variant === 'form') title = t('button.joinButton.registerLink');
  else if ((people >= maxPerson || shotgunClosed) && variant === 'shotgun')
    title = t('button.joinButton.shotgunClosed');
  else if (!selected) title = t('button.joinButton.register');
  else title = t('button.joinButton.unsuscribe');

  let color:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  if ((people >= maxPerson || shotgunClosed) && variant === 'shotgun') {
    color = 'error';
  } else if (selected) {
    color = 'success';
  } else {
    color = 'info';
  }
  return (
    <>
      <Button
        disabled={loading}
        onClick={() => onClick()}
        variant="contained"
        startIcon={getFirstIcon()}
        color={color}
        endIcon={getSecondIcon()}
        sx={sx}
        title={title}
      >
        {getText()}
        {loading && (
          <CircularProgress size={25} style={{ position: 'absolute' }} />
        )}
      </Button>
      <Dialog
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {CapitalizeFirstLetter(t('button.joinButton.unsuscribe'))} ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t('button.joinButton.title')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleClose(false)}>
            {t('button.cancel')}
          </Button>
          <Button
            onClick={() => handleClose(true)}
            autoFocus
            variant="contained"
          >
            {t('button.joinButton.unsuscribe')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

JoinButton.defaultProps = {
  variant: 'normal',
  link: '',
  maxPerson: 0,
  shotgunClosed: false,
  sx: {},
};

export default JoinButton;
