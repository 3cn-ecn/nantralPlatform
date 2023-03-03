import * as React from 'react';
import './EventCard.scss';

import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Avatar,
  CardActionArea,
} from '@mui/material/';

import { EventProps } from 'Props/Event';
import { ClubProps } from 'Props/Club';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import JoinButton from '../Button/JoinButton';

import FavButton from '../Button/FavButton';
import MoreActionsButton from '../Button/MoreActionsButton';

function InfoItem(props: { name: string; value: string }) {
  let icon = null;
  const { name, value } = props;
  const text = value;

  switch (name) {
    case 'date':
      icon = (
        <CalendarTodayIcon
          className="infoItemElement"
          sx={{ fontSize: '1.5em' }}
        />
      );
      break;
    case 'time':
      icon = (
        <AccessTimeIcon
          className="infoItemElement"
          sx={{ fontSize: '1.5em' }}
        />
      );
      break;
    default:
  }
  return (
    <div className="infoItem">
      {icon}
      <Typography
        sx={{ fontSize: '1.2em', paddingLeft: '7px' }}
        variant="subtitle2"
        className="infoItemElement"
      >
        {text}
      </Typography>
    </div>
  );
}

function EventCard(props: { event: EventProps }) {
  const { event } = props;
  const {
    title,
    numberOfParticipants,
    maxParticipant,
    beginDate,
    image,
    groupSlug,
    isParticipating,
    slug,
    formUrl,
    isFavorite,
    getAbsoluteUrl,
    endInscription,
    beginInscription,
    groupName,
  } = event;
  const [participating, setParticipating] = React.useState(isParticipating);
  const [groupData, setGroup] = React.useState<ClubProps>({
    name: '',
    icon: '',
    url: '',
    is_admin: false,
  });
  useEffect(() => {
    getGroup();
  }, []);

  const ref = useRef<HTMLHeadingElement>(null);
  // Scale of the font (multiplier of the browser's base font size)
  const [rem, setRem] = React.useState<number>(
    parseFloat(getComputedStyle(document.documentElement).fontSize)
  );

  const updateDimensions = () => {
    if (ref.current) {
      if (ref.current) {
        setRem(ref.current.offsetWidth / 28.125);
      }
    }
  };
  // This sets the dimensions on the first render
  useLayoutEffect(() => {
    updateDimensions();
  }, []);

  window.addEventListener('resize', () => {
    updateDimensions();
  });

  async function getGroup() {
    const response = await axios.get(`/api/group/group/${groupSlug}/`);
    setGroup(response.data);
  }

  const { i18n } = useTranslation('translation');

  let variant: 'shotgun' | 'normal' | 'form'; // Variant of the event : form, normal or shotgun
  if (formUrl !== null) variant = 'form';
  else if (maxParticipant === null) variant = 'normal';
  else variant = 'shotgun';

  // Conversion of the date to a human redeable format
  const dateValue = new Date(beginDate);
  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const dateText = dateValue.toLocaleDateString(i18n.language, dateFormat);
  const hourText = dateValue.toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });
  const groupIcon =
    typeof groupData.icon === 'undefined' ? (
      <CircularProgress size="3.75em" />
    ) : (
      <a href={window.location.origin + groupData.url}>
        <Avatar
          alt={groupData.name}
          src={groupData.icon}
          sx={{ fontSize: '1em', width: '3.75em', height: '3.75em' }}
        />
      </a>
    );
  return (
    <Card ref={ref} className="eventCard" sx={{ fontSize: `${rem}px` }}>
      <CardActionArea disableRipple sx={{ fontSize: '1em' }}>
        <CardMedia
          className="banner"
          component="img"
          image={image}
          alt="Banner"
        />
        <FavButton
          className="favIcon"
          eventSlug={slug}
          selected={isFavorite}
          size="3em"
        />
        <MoreActionsButton
          isAdmin={groupData.is_admin}
          className="moreActions"
          shareUrl={window.location.origin + getAbsoluteUrl}
          slug={slug}
          size="2em"
          participating={participating}
          setParticipating={setParticipating}
        />
        <CardContent sx={{ padding: 0 }}>
          <div className="infoContainer">
            <div className="infoMain">
              <div className="groupIcon">{groupIcon}</div>

              <div className="infos">
                <Typography
                  sx={{ fontSize: '1.5em', marginBottom: '0.2em' }}
                  variant="h5"
                  className="eventTitle"
                >
                  {title}
                </Typography>
                <Typography sx={{ fontSize: '1em' }} variant="caption">
                  {groupName}
                </Typography>
              </div>
            </div>
            <div className="infoDetails">
              <InfoItem name="date" value={dateText} />
              <InfoItem name="time" value={hourText} />
              <div className="joinButton">
                <JoinButton
                  variant={variant}
                  person={numberOfParticipants}
                  maxPerson={maxParticipant}
                  participating={participating}
                  eventSlug={slug}
                  link={formUrl}
                  beginInscription={beginInscription}
                  endInscription={endInscription}
                  setParticipating={setParticipating}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default EventCard;
