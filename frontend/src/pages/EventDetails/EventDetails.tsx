import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClubProps } from 'Props/Group';
import axios from 'axios';
import { LoadStatus } from 'Props/GenericTypes';
import './EventDetails.scss';
import { useTranslation } from 'react-i18next';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import PeopleIcon from '@mui/icons-material/People';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FavButton from '../../components/Button/FavButton';
import JoinButton from '../../components/Button/JoinButton';
import { ClubAvatar } from '../../components/ClubAvatar/ClubAvatar';
import { EventParticipantsModal } from '../../components/Modal/EventParticipantsModal';
import { ImageModal } from '../../components/Modal/ImageModal';
import { EventProps, eventsToCamelCase } from '../../Props/Event';

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
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [groupData, setGroup] = useState<ClubProps>({
    name: '',
    icon: '',
    url: '',
    is_admin: false,
  });
  const handleClickMenu = (mouseEvent: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(mouseEvent.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const matches = useMediaQuery('(min-width:600px)');

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
        setParticipating(response.data.isParticipating);
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

  let variant: 'shotgun' | 'normal' | 'form'; // Variant of the event : form, normal or shotgun
  if (event.formUrl !== null) variant = 'form';
  else if (event.maxParticipant === null) variant = 'normal';
  else variant = 'shotgun';

  // Conversion of the date to a human redeable format
  const beginDateValue = new Date(event.beginDate);
  const endDateValue = new Date(event.endDate);
  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const beginDateText = beginDateValue.toLocaleDateString(
    i18n.language,
    dateFormat
  );
  const beginHourText = beginDateValue.toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });

  const endDateText = endDateValue.toLocaleDateString(
    i18n.language,
    dateFormat
  );
  const endHourText = endDateValue.toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });

  const endSameDay = endDateText === beginDateText ? ` - ${endHourText}` : null;

  const endSection =
    endDateText !== beginDateText ? (
      <>
        <Typography
          className="adaptativeText"
          variant="h5"
          sx={{ marginTop: '1rem', marginBottom: '0.5rem' }}
        >
          {t('event.endTime')}
        </Typography>
        <div
          style={{
            display: 'flex',
            marginTop: '1rem',
            flexDirection: matches ? 'row' : 'column',
          }}
        >
          <div className="infoElement">
            <CalendarTodayIcon
              sx={{ fontSize: '1.5rem', marginRight: '1rem' }}
            />
            <Typography className="adaptativeText" variant="h5">
              {endDateText}
            </Typography>
          </div>
          <div className="infoElement">
            <AccessTimeIcon sx={{ fontSize: '1.5rem', marginRight: '1rem' }} />
            <Typography className="adaptativeText" variant="h5">
              {endHourText}
            </Typography>
          </div>
        </div>
      </>
    ) : null;

  let endInscriptionSection = null;

  if (event.endInscription !== null) {
    const endInscriptionValue = new Date(event.endInscription);
    const endInscriptioneText = endInscriptionValue.toLocaleDateString(
      i18n.language,
      dateFormat
    );
    const endInscriptionText = endInscriptionValue.toLocaleTimeString(
      i18n.language,
      {
        timeStyle: 'short',
      }
    );

    endInscriptionSection =
      event.endInscription !== null ? (
        <Alert variant="outlined" severity="info" sx={{ marginTop: '1rem' }}>
          {t('event.endInscription')} {endInscriptioneText} -{' '}
          {endInscriptionText}
        </Alert>
      ) : null;
  }

  const adminSection = groupData.is_admin ? (
    <>
      <Button
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={handleClickMenu}
        sx={{
          minWidth: 0,
          fontSize: '1rem',
          borderRadius: '2rem',
          padding: '0.3125rem',
          marginLeft: 'auto',
        }}
        color="primary"
        variant="outlined"
      >
        <MoreHorizIcon color="primary" />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            window.open(`/event/${event.id}/edit`, '_blank', 'noreferrer');
            handleCloseMenu();
          }}
        >
          <EditIcon sx={{ marginRight: '0.625rem' }} />
          {t('event.action_menu.edit')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenModal(true);
            handleCloseMenu();
          }}
        >
          <PeopleIcon sx={{ marginRight: '0.625rem' }} />
          {t('event.participants')}
        </MenuItem>
      </Menu>
    </>
  ) : null;

  const banner =
    event.image === null ? '/static/img/default-banner.png' : event.image;

  return (
    <>
      <Container>
        <Box
          component="img"
          className="banner"
          src={banner}
          alt="Banner"
          onClick={() => {
            setOpenImageModal(true);
          }}
        />
        <Typography
          className="adaptativeText"
          variant="h3"
          sx={{
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          {event.title}
        </Typography>

        <Grid container rowSpacing={1} columnSpacing={6}>
          <Grid item xs={12} sm={5} md={3}>
            <JoinButton
              variant={variant}
              person={event.numberOfParticipants}
              maxPerson={event.maxParticipant}
              participating={participating}
              eventId={event.id}
              link={event.formUrl}
              beginInscription={event.beginInscription}
              endInscription={event.endInscription}
              setParticipating={setParticipating}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={7}
            md={9}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <div>
              <FavButton
                eventId={event.id}
                selected={event.isFavorite}
                size="2rem"
              />
              <Button
                startIcon={<ShareIcon />}
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/event/${event.id}`
                  );
                  setOpenCopyNotif(true);
                }}
                sx={{ marginLeft: '0.625rem' }}
              >
                {t('event.action_menu.share')}
              </Button>
            </div>
            <div>{adminSection}</div>
          </Grid>
        </Grid>
        <ClubAvatar
          clubUrl={groupData.url}
          logoUrl={groupData.icon}
          name={groupData.name}
          textPosition="right"
          size="3.75rem"
        />
        {endInscriptionSection}
        <div
          style={{
            display: 'flex',
            marginTop: '1rem',
            flexDirection: matches ? 'row' : 'column',
          }}
        >
          <div className="infoElement">
            <CalendarTodayIcon
              sx={{ fontSize: '1.5rem', marginRight: '1rem' }}
            />
            <Typography className="adaptativeText" variant="h5">
              {beginDateText}
            </Typography>
          </div>
          <div className="infoElement">
            <AccessTimeIcon sx={{ fontSize: '1.5rem', marginRight: '1rem' }} />
            <Typography className="adaptativeText" variant="h5">
              {beginHourText} {endSameDay}
            </Typography>
          </div>
          <div className="infoElement" style={{ minWidth: 0 }}>
            <PlaceIcon sx={{ fontSize: '1.5rem', marginRight: '1rem' }} />
            <Typography
              className="adaptativeText"
              variant="h5"
              sx={{ minWidth: 0 }}
            >
              {event.location}
            </Typography>
          </div>
        </div>
        {endSection}

        <Grid container spacing={1}>
          <Grid item xs={12} sm={3}></Grid>
        </Grid>

        <Typography variant="caption" sx={{ textAlign: 'justify' }}>
          <div
            style={{
              marginTop: '2rem',
              marginBottom: '10rem',
              fontSize: '1rem',
            }}
            dangerouslySetInnerHTML={{
              __html: event.description,
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
      </Container>
      <EventParticipantsModal
        event={event}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
      <ImageModal
        open={openImageModal}
        onClose={() => {
          setOpenImageModal(false);
        }}
        url={banner}
      />
    </>
  );
}

export default EventDetails;
