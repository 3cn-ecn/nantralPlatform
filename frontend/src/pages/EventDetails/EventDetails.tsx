import {
  Avatar,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClubProps } from 'Props/Group';
import axios from 'axios';
import { LoadStatus } from 'Props/GenericTypes';
import './EventDetails.scss';
import DOMRPurify from 'dompurify';
import { display, rgbToHex } from '@mui/system';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton/IconButton';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import PeopleIcon from '@mui/icons-material/People';

import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FavButton from '../../components/Button/FavButton';
import JoinButton from '../../components/Button/JoinButton';
import ClubAvatar from '../../components/ClubAvatar/ClubAvatar';
import { EventParticipantsModal } from '../../components/Modal/EventParticipantsModal';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import theme from '../../theme';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EventDetails() {
  const { i18n, t } = useTranslation('translation');
  const { id } = useParams();
  const [event, setEvent] = useState<EventProps>(undefined);
  const [participating, setParticipating] = useState(false);
  const [openCopyNotif, setOpenCopyNotif] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [groupData, setGroup] = useState<ClubProps>({
    name: '',
    icon: '',
    url: '',
    is_admin: false,
  });

  useEffect(() => {
    getEvent();
  }, []);
  useEffect(() => {
    getGroup();
  }, [event]);
  const [eventStatus, setEventStatus] = useState<LoadStatus>('load');

  async function getEvent() {
    await axios
      .get(`/api/event/${id}`)
      .then((response) => {
        eventsToCamelCase([response.data]);
        setEvent(response.data);
        setParticipating(event.isParticipating);
        setEventStatus('success');
      })
      .catch((error) => {
        setEventStatus('fail');
      });
  }

  async function getGroup() {
    if (event !== undefined) {
      await axios
        .get(`/api/group/group/${event.groupSlug}/`)
        .then((response) => {
          setGroup(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  if (eventStatus === 'load') {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <Container className="loading" sx={{ display: 'flex' }}>
          <CircularProgress color="primary" />
        </Container>
      </div>
    );
  }

  const descriptionCopy = event.description;
  let variant: 'shotgun' | 'normal' | 'form'; // Variant of the event : form, normal or shotgun
  if (event.formUrl !== null) variant = 'form';
  else if (event.maxParticipant === null) variant = 'normal';
  else variant = 'shotgun';

  // Conversion of the date to a human redeable format
  const dateValue = new Date(event.beginDate);
  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const dateText = dateValue.toLocaleDateString(i18n.language, dateFormat);
  const hourText = dateValue.toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });

  const adminSection = groupData.is_admin ? (
    <div>
      <IconButton
        sx={{
          padding: '1.2rem',
          background: rgbToHex(theme.palette.secondary.main).concat('b5'),
          backdropFilter: 'blur(4px)',
          width: '2rem',
          height: '2rem',
          fontSize: '1rem',
          '&:hover': {
            background: rgbToHex(theme.palette.primary.main).concat('b5'),
          },
        }}
        onClick={() => {
          window.open(`/event/${event.id}/edit`, '_blank', 'noreferrer');
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        sx={{
          padding: '1.2rem',
          background: rgbToHex(theme.palette.secondary.main).concat('b5'),
          backdropFilter: 'blur(4px)',
          width: '2rem',
          height: '2rem',
          fontSize: '1rem',
          marginLeft: '0.5rem',
          '&:hover': {
            background: rgbToHex(theme.palette.primary.main).concat('b5'),
          },
        }}
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <PeopleIcon />
      </IconButton>
    </div>
  ) : null;

  return (
    <Container>
      <img className="banner" src={event.image} alt="Banner" />
      <Typography className="adaptativeText" variant="h3">
        {event.title}
      </Typography>

      <Grid container spacing={6}>
        <Grid item xs={6}>
          <ClubAvatar
            clubUrl={groupData.url}
            logoUrl={groupData.icon}
            name={groupData.name}
            textPosition="right"
            size="5rem"
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'column',
          }}
        >
          {adminSection}
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <CalendarTodayIcon sx={{ fontSize: '1.5rem', marginRight: '1rem' }} />
          <Typography className="adaptativeText" variant="h5">
            {dateText}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <AccessTimeIcon sx={{ fontSize: '1.5rem', marginRight: '1rem' }} />
          <Typography className="adaptativeText" variant="h5">
            {hourText}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <PlaceIcon sx={{ fontSize: '1.5rem', marginRight: '1rem' }} />
          <Typography className="adaptativeText" variant="h5">
            {event.location}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={3}>
          <JoinButton
            variant={variant}
            person={event.numberOfParticipants}
            maxPerson={event.maxParticipant}
            participating={participating}
            eventSlug={event.slug}
            link={event.formUrl}
            beginInscription={event.beginInscription}
            endInscription={event.endInscription}
            setParticipating={setParticipating}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <FavButton
            eventSlug={event.slug}
            selected={event.isFavorite}
            size="2rem"
          />
          <IconButton
            sx={{
              padding: '1.2rem',
              background: rgbToHex(theme.palette.secondary.main).concat('b5'),
              backdropFilter: 'blur(4px)',
              width: '2rem',
              height: '2rem',
              fontSize: '1rem',
              marginLeft: '0.5rem',
              '&:hover': {
                background: rgbToHex(theme.palette.primary.main).concat('b5'),
              },
            }}
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/event/${event.id}`
              );
              setOpenCopyNotif(true);
            }}
          >
            <ShareIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Typography variant="caption" sx={{ textAlign: 'justify' }}>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMRPurify.sanitize(descriptionCopy),
          }}
        ></div>
      </Typography>

      <Grid container spacing={2}></Grid>
      <Snackbar
        open={openCopyNotif}
        autoHideDuration={2000}
        onClose={() => setOpenCopyNotif(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('event.action_menu.linkCopied')}
        </Alert>
      </Snackbar>
      <EventParticipantsModal
        event={event}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </Container>
  );
}

export default EventDetails;
