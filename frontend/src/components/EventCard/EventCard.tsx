/* eslint-disable camelcase */
import * as React from 'react';
import './EventCard.scss';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Avatar, CardActionArea } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';

import { EventProps } from 'pages/Props/Event';
import { ClubProps } from 'pages/Props/Club';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';

import JoinButton from '../Button/JoinButton';

import FavButton from '../Button/FavButton';
import MoreActionsButton from '../Button/MoreActionsButton';

function InfoItem(props: { name: string; value: string }) {
  let icon = null;
  const { name, value } = props;
  const text = value;
  const specificClass =
    name === 'location' ? 'infoItemShrinkable' : 'infoItemMaxSize';
  switch (name) {
    case 'date':
      icon = <CalendarTodayIcon className="infoItemElement" />;
      break;
    case 'time':
      icon = <AccessTimeIcon className="infoItemElement" />;
      break;
    case 'location':
      icon = <LocationOnIcon className="infoItemElement" />;

      break;
    default:
  }
  return (
    <div className={`infoItem ${specificClass}`}>
      {icon}
      <div className="infoItemElement" style={{ paddingLeft: '7px' }}>
        {text}
      </div>
    </div>
  );
}

function EventCard(props: { event: EventProps }) {
  const { t } = useTranslation('translation'); // translation module
  const { event } = props;
  const {
    title,
    number_of_participants,
    max_participant,
    location,
    date,
    image,
    group,
    get_group_name,
    is_participating,
    slug,
    ticketing,
    is_favorite,
    get_absolute_url,
  } = event;

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
  if (ticketing !== null) variant = 'form';
  else if (max_participant === null) variant = 'normal';
  else variant = 'shotgun';

  // Conversion of the date to a human redeable format
  const dateValue = new Date(date);
  const dateText = `
    ${t(`event.days.${dateValue.getDay()}`)}
    ${dateValue.getDate()} ${t(`event.months.${dateValue.getMonth() + 1}`)}`;
  const hourText = `${dateValue.getHours()}:${dateValue.getMinutes()}`;

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
      <CardActionArea disableRipple sx={{ fontSize: '1rem' }}>
        <CardMedia
          className="banner"
          component="img"
          image={image}
          alt="Banner"
        />
        <FavButton
          className="favIcon"
          eventSlug={slug}
          selected={is_favorite}
          size="2.1em"
        />
        <MoreActionsButton
          isAdmin={groupData.is_current_user_admin}
          className="moreActions"
          shareUrl={window.location.origin + get_absolute_url}
          slug={slug}
          size="1.7em"
        />
        <CardContent sx={{ padding: 0 }}>
          <div className="infoContainer">
            <div className="infoMain">
              <div className="groupIcon">{groupIcon}</div>

              <div className="infos">
                <h2 className="eventTitle">{title}</h2>
                <div>{get_group_name}</div>
              </div>
              <div className="joinButton">
                <JoinButton
                  variant={variant}
                  person={number_of_participants}
                  maxPerson={max_participant}
                  participating={is_participating}
                  eventSlug={slug}
                  link={ticketing}
                />
              </div>
            </div>
            <div className="infoDetails">
              <InfoItem name="date" value={dateText} />
              <InfoItem name="time" value={hourText} />
              <InfoItem name="location" value={location} />
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default EventCard;
