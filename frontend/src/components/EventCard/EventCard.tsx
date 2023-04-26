import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Skeleton,
  Typography,
} from '@mui/material/';

import { EventProps, FormEventProps } from '#types/Event';

import FavButton from '../Button/FavButton';
import JoinButton from '../Button/JoinButton';
import MoreActionsButton from '../Button/MoreActionsButton';
import { ClubAvatar } from '../ClubAvatar/ClubAvatar';
import './EventCard.scss';

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
        style={{ paddingLeft: '7px' }}
      >
        {text}
      </Typography>
    </div>
  );
}

function EventCard(props: {
  event: EventProps;
  onUpdate?: (newEvent: FormEventProps) => void;
  onDelete?: () => void;
}) {
  const { event, onDelete, onUpdate } = props;
  const {
    title,
    numberOfParticipants,
    maxParticipant,
    startDate,
    image,
    isParticipating,
    formUrl,
    isFavorite,
    endRegistration,
    startRegistration,
    id,
  } = event;
  const [participating, setParticipating] = useState(isParticipating);

  const { i18n } = useTranslation('translation');

  let variant: 'shotgun' | 'normal' | 'form'; // Variant of the event : form, normal or shotgun
  if (formUrl) variant = 'form';
  else if (maxParticipant === null) variant = 'normal';
  else variant = 'shotgun';

  // Conversion of the date to a human redeable format
  const dateValue = new Date(startDate);
  const dateFormat: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const dateText = dateValue.toLocaleDateString(i18n.language, dateFormat);
  const hourText = dateValue.toLocaleTimeString(i18n.language, {
    timeStyle: 'short',
  });
  const iconSize = '3.75rem';
  const groupIcon =
    typeof event.group.icon === 'undefined' ? (
      <CircularProgress size={iconSize} />
    ) : (
      <ClubAvatar
        clubUrl={event.group.url}
        logoUrl={event.group.icon}
        name={event.group.name}
        textPosition="bottom"
        size={iconSize}
        hideName
      />
    );
  const navigate = useNavigate();
  const banner = image === null ? '/static/img/default-banner.png' : image;
  return (
    <div style={{ position: 'relative' }}>
      <Card className="eventCard" sx={{ fontSize: '1rem' }}>
        <CardActionArea
          disableRipple
          sx={{ fontSize: '1rem' }}
          onClick={() => {
            navigate(`/event/${id}/`);
          }}
        >
          <CardMedia
            className="eventBanner"
            component="img"
            image={banner}
            alt="Banner"
          />
          <CardContent sx={{ padding: 0 }}>
            <div className="infoContainer">
              <div className="infoMain">
                <div style={{ minWidth: iconSize, minHeight: iconSize }}></div>

                <div className="infos">
                  <Typography
                    sx={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}
                    variant="h5"
                    className="eventTitle"
                  >
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem' }} variant="caption">
                    {event.group.name}
                  </Typography>
                </div>
              </div>
              <div className="infoDetails">
                <InfoItem name="date" value={dateText} />
                <InfoItem name="time" value={hourText} />
              </div>
            </div>
          </CardContent>
        </CardActionArea>
        <div className="joinButton">
          <JoinButton
            variant={variant}
            person={numberOfParticipants}
            maxPerson={maxParticipant}
            participating={participating}
            eventId={id}
            link={formUrl}
            startRegistration={startRegistration}
            endRegistration={endRegistration}
            setParticipating={setParticipating}
            sx={{ width: '100%' }}
          />
        </div>
      </Card>
      <div className="groupIcon">{groupIcon}</div>
      <div className="topButtons">
        <div className="favIcon">
          <FavButton eventId={id} selected={isFavorite} size="2rem" iconized />
        </div>
        <MoreActionsButton
          isAdmin={false}
          className="moreActions"
          shareUrl={`${window.location.origin}/event/${id}`}
          id={id}
          size="2rem"
          participating={participating}
          setParticipating={setParticipating}
        />
      </div>
    </div>
  );
}

EventCard.defaultProps = {
  onUpdate: () => null,
  onDelete: () => null,
};

export function EventCardSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      height="22.85rem"
      sx={{ fontSize: '1rem' }}
    />
  );
}

export default EventCard;
