import {
  PeopleAlt as PeopleIcon,
  AddCircle as PlusIcon,
  CheckCircle as CheckIcon,
  LinkOutlined as LinkIcon,
  LocalFireDepartment as ShotgunIcon,
  Cancel as Cross,
  Info,
} from '@mui/icons-material';
import {
  Button,
  Theme,
  SxProps,
  CircularProgress,
  Typography,
  MenuItem,
  rgbToHex,
  Popover,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import * as React from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { ConfirmationModal } from '../Modal/ConfirmationModal';

import theme from '../../theme';
import { EventPopover, TextPopover } from './InformationPopover';

interface JoinButtonProps {
  variant?: 'shotgun' | 'normal' | 'form';
  link?: string;
  maxPerson?: number;
  person: number;
  sx?: SxProps<Theme>;
  participating: boolean;
  eventId: number;
  beginInscription: Date | null;
  endInscription: Date | null;
  unregisterOnly?: boolean;
  setParticipating: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick?: () => void;
  hideInfoButton?: boolean;
}

function JoinButton({
  variant,
  link,
  maxPerson,
  person,
  sx,
  participating,
  eventId,
  beginInscription,
  endInscription,
  unregisterOnly,
  setParticipating,
  handleClick,
  hideInfoButton,
}: JoinButtonProps): JSX.Element {
  const [selected, setSelected] = React.useState(participating);
  const [people, setPeople] = React.useState(person);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [tootlTipOpen, setTooltipOpen] = React.useState(false);
  const buttonRef = React.useRef();
  React.useEffect(() => {
    if (loaded) {
      setSelected(participating);
      if (participating) {
        setPeople(people + 1);
      } else {
        setPeople(people - 1);
      }
    }
    setLoaded(true);
  }, [participating]);

  const { t } = useTranslation('translation');
  const inscriptionFinished: boolean =
    endInscription !== null && Date.now() > new Date(endInscription).getTime();
  const shotgunFull = variant === 'shotgun' && person >= maxPerson;
  const closed: boolean = shotgunFull || inscriptionFinished;
  const inscriptionNotStarted: boolean =
    beginInscription !== null &&
    Date.now() < new Date(beginInscription).getTime();
  const participate = async () => {
    axios
      .post(`/api/event/${eventId}/participate`)
      .then((res) => {
        if (res.data.success) {
          setSelected(true);
          setParticipating(true);
        } else {
          console.error('could not subscribe to event');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const quit = async () => {
    axios
      .delete(`/api/event/${eventId}/participate`)
      .then((res) => {
        if (res.data.success) {
          setSelected(false);
          setParticipating(false);
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
    handleClick();
  };
  const onClick = () => {
    switch (variant) {
      case 'normal':
        if (closed || inscriptionNotStarted) return;
        if (selected) {
          setOpen(true);
        } else {
          setLoading(true);
          participate();
        }
        break;
      case 'shotgun':
        if ((closed && !selected) || inscriptionNotStarted) return;
        if (selected) {
          setOpen(true);
        } else {
          setLoading(true);
          participate();
        }
        break;
      case 'form':
        window.open(link);
        break;
      default:
    }
  };

  const getFirstIcon = () => {
    // if (inscriptionNotStarted) return null;
    switch (variant) {
      case 'shotgun':
        return (
          <div
            style={{
              flexDirection: 'row',
              display: 'flex',
              fontSize: '14px',
              alignItems: 'center',
            }}
          >
            <ShotgunIcon sx={{ color: '#fff' }} />
          </div>
        );
      case 'form':
        return <LinkIcon sx={{ color: '#fff' }} />;
      default:
        return <PeopleIcon sx={{ color: '#fff' }} />;
    }
  };
  const getSecondIcon = () => {
    if (inscriptionNotStarted) return null;
    if (closed && variant !== 'form') return <Cross sx={{ color: '#fff' }} />;
    if (variant === 'normal')
      return selected ? (
        <CheckIcon sx={{ color: '#fff' }} />
      ) : (
        <PlusIcon sx={{ color: '#fff' }} />
      );
    if (variant === 'shotgun') {
      if (closed && !selected) return <Cross />;
      if (selected) return <CheckIcon sx={{ color: '#fff' }} />;
      return selected ? (
        <CheckIcon sx={{ color: '#fff' }} />
      ) : (
        <PlusIcon sx={{ color: '#fff' }} />
      );
    }
    return null;
  };
  const getText = () => {
    switch (variant) {
      case 'normal':
        return (
          <Typography sx={{ color: '#fff' }}>
            {inscriptionNotStarted ? 'Inscription' : people}
          </Typography>
        );
      case 'shotgun':
        return (
          <Typography sx={{ color: '#fff' }}>
            {inscriptionNotStarted
              ? new Date(beginInscription).toLocaleDateString(i18n.language, {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })
              : `${people}/${maxPerson}`}
          </Typography>
        );
      case 'form':
        return (
          <Typography sx={{ color: '#fff' }}>
            {t('button.joinButton.register')}
          </Typography>
        );
      default:
        return people;
    }
  };
  let title: string;
  if (variant === 'form') title = t('button.joinButton.registerLink');
  else if (closed && variant === 'shotgun')
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
  if (selected) {
    color = 'success';
  } else if (closed) {
    color = 'warning';
  } else {
    color = 'info';
  }
  if (unregisterOnly) {
    return (
      <>
        <MenuItem
          onClick={() => onClick()}
          style={{ color: rgbToHex(theme.palette.error.main) }}
        >
          <HighlightOffIcon
            className="itemIcon"
            style={{ color: rgbToHex(theme.palette.error.main) }}
          />
          {t('event.action_menu.unsubscribe')}
        </MenuItem>
        <ConfirmationModal
          open={open}
          title={t('button.joinButton.unsuscribe')}
          content={t('button.joinButton.title')}
          onClose={handleClose}
        />
      </>
    );
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          disabled={loading || inscriptionNotStarted || closed}
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
        {inscriptionNotStarted ? (
          <EventPopover
            anchorRef={buttonRef}
            beginInscription={beginInscription}
            maxParticipant={maxPerson}
            onClose={() => setTooltipOpen(false)}
            open={tootlTipOpen}
          />
        ) : (
          <TextPopover
            anchorRef={buttonRef}
            onClose={() => setTooltipOpen(false)}
            open={tootlTipOpen}
          >
            {shotgunFull
              ? "l'évènement est complet"
              : 'les inscriptions sont terminées'}
          </TextPopover>
        )}
        {!hideInfoButton && (closed || inscriptionNotStarted) && (
          <IconButton
            sx={{ marginLeft: 1, padding: 0 }}
            ref={buttonRef}
            aria-describedby="id"
            onClick={() => setTooltipOpen(!tootlTipOpen)}
          >
            <Info color="secondary" />
          </IconButton>
        )}
      </div>
      <ConfirmationModal
        open={open}
        title={t('button.joinButton.unsuscribe')}
        content={t('button.joinButton.title')}
        onClose={handleClose}
      />
    </>
  );
}

JoinButton.defaultProps = {
  variant: 'normal',
  link: '',
  maxPerson: 0,
  sx: {},
  unregisterOnly: false,
  handleClick: {},
  hideInfoButton: false,
};

export default JoinButton;
