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
import { ClubProps } from 'Props/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        style={{ paddingLeft: '7px' }}
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
    endInscription,
    beginInscription,
    groupName,
    id,
  } = event;
  const [participating, setParticipating] = useState(isParticipating);
  const [groupData, setGroup] = useState<ClubProps>({
    name: '',
    icon: '',
    url: '',
    is_admin: false,
  });
  useEffect(() => {
    getGroup();
  }, []);

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
      <CircularProgress size="3.75rem" />
    ) : (
      <a href={window.location.origin + groupData.url}>
        <Avatar
          alt={groupData.name}
          src={groupData.icon}
          sx={{ fontSize: '1rem', width: '3.75rem', height: '3.75rem' }}
        />
      </a>
    );
  const navigate = useNavigate();
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
            image={image}
            alt="Banner"
          />
          <CardContent sx={{ padding: 0 }}>
            <div className="infoContainer">
              <div className="infoMain">
                <div className="groupIcon">{groupIcon}</div>

                <div className="infos">
                  <Typography
                    sx={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}
                    variant="h5"
                    className="eventTitle"
                  >
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '1rem' }} variant="caption">
                    {groupName}
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
            eventSlug={slug}
            link={formUrl}
            beginInscription={beginInscription}
            endInscription={endInscription}
            setParticipating={setParticipating}
            sx={{ width: '100%' }}
          />
        </div>
      </Card>
      <div className="topButtons">
        <div className="favIcon">
          <FavButton
            eventSlug={slug}
            selected={isFavorite}
            size="2rem"
            iconized
          />
        </div>
        <MoreActionsButton
          isAdmin={groupData.is_admin}
          className="moreActions"
          shareUrl={`${window.location.origin}/event/${id}`}
          id={id}
          slug={slug}
          size="2rem"
          participating={participating}
          setParticipating={setParticipating}
        />
      </div>
    </div>
  );
}

export default EventCard;
