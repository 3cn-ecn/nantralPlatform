import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Menu,
  MenuItem,
  Tab,
  Tabs,
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
import EditEventModal from '../../components/FormEvent/FormEvent';
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
  const today = new Date();
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
  const [formEventOpen, setFormEventOpen] = React.useState<boolean>(false);

  const [infoTab, setInfoTab] = React.useState<number>(0);

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
        console.error(error);
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
          console.error(error);
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

  const registrationStarted =
    !event.beginInscription ||
    event.beginInscription.getTime() < today.getTime();

  const registrationEnded =
    event.endInscription && event.endInscription.getTime() < today.getTime();

  const endSameDay = endDateText === beginDateText ? ` - ${endHourText}` : null;

  const beginSection = (
    <div
      style={{
        display: 'flex',
        marginTop: '1rem',
        flexDirection: matches ? 'row' : 'column',
        rowGap: '1rem',
        columnGap: '1rem',
        flexGrow: 1,
      }}
    >
      <Chip
        icon={<CalendarTodayIcon />}
        sx={{
          height: 'auto',
          padding: 1,
          '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
          },
        }}
        label={beginDateText}
      />
      <Chip
        icon={<AccessTimeIcon />}
        sx={{
          height: 'auto',
          padding: 1,
          '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
          },
        }}
        label={`${beginHourText} ${endSameDay}`}
      />
    </div>
  );
  const endSection =
    endDateText !== beginDateText ? (
      <>
        {/* <Typography
          className="adaptativeText"
          variant="h5"
          sx={{ marginTop: '1rem', marginBottom: '0.5rem' }}
        >
          {t('event.endTime')}
        </Typography> */}
        <div
          style={{
            display: 'flex',
            marginTop: '1rem',
            flexDirection: matches ? 'row' : 'column',
            gap: '1rem',
          }}
        >
          <Chip
            icon={<CalendarTodayIcon />}
            sx={{
              height: 'auto',
              padding: 1,
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
              },
            }}
            label={endDateText}
          />
          <Chip
            icon={<AccessTimeIcon />}
            sx={{
              height: 'auto',
              padding: 1,
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
              },
            }}
            label={endHourText}
          />
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
      !registrationEnded && registrationStarted ? (
        <Alert variant="outlined" severity="info" sx={{ marginTop: '1rem' }}>
          {t('event.endInscription')} {endInscriptioneText} -{' '}
          {endInscriptionText}
        </Alert>
      ) : null;
  }

  const beginInsciptionAlert = !registrationStarted && (
    <Alert variant="outlined" severity="info" sx={{ marginTop: '1rem' }}>
      {`${t(
        'event.inscriptionsBeginAt'
      )} ${event.beginInscription.toLocaleDateString(
        i18n.language,
        dateFormat
      )} - ${event.beginInscription.toLocaleTimeString(i18n.language, {
        timeStyle: 'short',
      })}`}
    </Alert>
  );

  const fullEventAlert = event.maxParticipant &&
    event.numberOfParticipants >= event.maxParticipant && (
      <Alert variant="outlined" severity="warning" sx={{ marginTop: '1rem' }}>
        {t('event.eventIsFull')}
      </Alert>
    );

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
            // window.open(`/event/${event.id}/edit`, '_blank', 'noreferrer');
            setFormEventOpen(true);
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

  const infoSection = (
    <Box sx={{ width: '100%', marginTop: 1 }}>
      <Chip
        icon={<PlaceIcon />}
        sx={{
          height: 'auto',
          padding: 1,
          '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
          },
        }}
        label={event.location}
      />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={infoTab}
          onChange={(_, newValue: number) => setInfoTab(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label={endSection ? 'Begin' : 'Hours'} />
          {endSection && <Tab label="End" />}
          <Tab label="Registration" />
        </Tabs>
      </Box>
      {infoTab === 0 && beginSection}
      {infoTab === 1 && endSection}
    </Box>
  );
  return (
    <>
      <Container disableGutters>
        <Box
          component="img"
          className="banner"
          src={banner}
          alt="Banner"
          onClick={() => {
            setOpenImageModal(true);
          }}
        />
      </Container>
      <Container>
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
              hideInfoButton
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
          size="3rem"
        />
        {fullEventAlert}
        {beginInsciptionAlert}
        {endInscriptionSection}
        {infoSection}

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
      <EditEventModal
        closeModal={() => setFormEventOpen(false)}
        open={formEventOpen}
        event={event}
        mode="edit"
        onUpdate={(newEvent: EventProps) => setEvent(newEvent)}
        // eslint-disable-next-line no-restricted-globals
        onDelete={() => history.back()}
      />
    </>
  );
}

export default EventDetails;
