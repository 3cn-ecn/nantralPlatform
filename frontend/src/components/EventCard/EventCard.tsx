/* eslint-disable camelcase */
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
import i18next from 'i18next';
import JoinButton from '../Button/JoinButton';

import FavButton from '../Button/FavButton';
import MoreActionsButton from '../Button/MoreActionsButton';

function InfoItem(props: { name: string; value: string }) {
  let icon = null;
  const { name, value } = props;
  const text = value;

  switch (name) {
    case 'date':
      icon = <CalendarTodayIcon className="infoItemElement" />;
      break;
    case 'time':
      icon = <AccessTimeIcon className="infoItemElement" />;
      break;
    default:
  }
  return (
    <div className="infoItem">
      {icon}
      <Typography
        variant="subtitle2"
        className="infoItemElement"
        style={{ paddingLeft: '7px' }}
      >
        {text}
      </Typography>
    </div>
  );
}

function EventCard(props: { event: EventProps; scale?: string }) {
  const { event, scale } = props;
  const {
    title,
    numberOfParticipants,
    maxParticipant,
    beginDate,
    image,
    group,
    getGroupName,
    isParticipating,
    slug,
    formUrl,
    isFavorite,
    getAbsoluteUrl,
    endInscription,
    beginInscription,
  } = event;

  const [participating, setParticipating] = React.useState(isParticipating);

  // An exception is made for the BDE as the "club" needs to be removed from the slug
  // (Not the case for the other clubs)
  const groupSlug =
    group === 'club--bde-1' ? group.slice(6, group.length) : group;
  const [groupData, setGroup] = React.useState<ClubProps>({
    name: '',
    logo_url: '',
    get_absolute_url: '',
    is_current_user_admin: false,
  });
  React.useEffect(() => {
    getGroup();
  }, []);

  async function getGroup() {
    const response = await axios.get(`api/club/${groupSlug}`);
    setGroup(response.data);
  }

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
  const dateText = dateValue.toLocaleDateString(i18next.language, dateFormat);
  const hourText = dateValue.toLocaleTimeString(i18next.language, {
    timeStyle: 'short',
  });
  const groupIcon =
    typeof groupData.logo_url === 'undefined' ? (
      <CircularProgress size="3.75em" />
    ) : (
      <a href={window.location.origin + groupData.get_absolute_url}>
        <Avatar
          alt={groupData.name}
          src={groupData.logo_url}
          sx={{ fontSize: '1em', width: '3.75em', height: '3.75em' }}
        />
      </a>
    );
  return (
    <Card className="eventCard">
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
          isAdmin={groupData.is_current_user_admin}
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
                <Typography variant="h5" className="eventTitle">
                  {title}
                </Typography>
                <Typography variant="caption">{getGroupName}</Typography>
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

EventCard.defaultProps = {
  scale: '1rem',
};

export default EventCard;
