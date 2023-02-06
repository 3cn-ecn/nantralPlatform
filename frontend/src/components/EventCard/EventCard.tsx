/* eslint-disable camelcase */
import * as React from 'react';
import './EventCard.scss';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';

import { EventProps } from 'pages/Props/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';

import JoinButton from '../Button/JoinButton';

import FavButton from '../Button/FavButton';
import MoreActionsButton from '../Button/MoreActionsButton';

interface EventCardProps {
  banner?: string;
  groupIcon?: string;
  bannerDescription?: string;
  variant?: 'shotgun' | 'normal' | 'form';
}

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

  const groupSlug =
    group === 'club--bde-1' ? group.slice(6, group.length) : group;
  const [groupData, setGroup] = React.useState<ClubProps>([]);
  React.useEffect(() => {
    getGroup();
  }, []);

  async function getGroup() {
    const response = await axios.get(`api/club/${groupSlug}`);
    setGroup(response.data);
  }

  let variant; //= max_participant === null ? 'normal' : 'shotgun';
  if (ticketing !== null) variant = 'form';
  else if (max_participant === null) variant = 'normal';
  else variant = 'shotgun';
  const bannerDescription = 'Banner';

  const dateValue = new Date(date);
  const dateText = `${dateValue.getDate()} ${t(
    `event.months.${dateValue.getMonth() + 1}`
  )} ${dateValue.getFullYear()}`;
  const hourText = `${dateValue.getHours()}:${dateValue.getMinutes()}`;

  const groupIcon =
    typeof groupData.logo_url === 'undefined' ? (
      <CircularProgress size="60px" />
    ) : (
      <img
        className="groupIcon loadedGroupIcon"
        src={groupData.logo_url}
        alt={bannerDescription}
      />
    );
  return (
    <Card className="eventCard">
      <CardActionArea disableRipple>
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
        />
        <MoreActionsButton
          isAdmin={groupData.is_current_user_admin}
          className="moreActions"
          shareUrl={window.location.origin + get_absolute_url}
          slug={slug}
        />
        <CardContent sx={{ padding: 0 }}>
          <div className="infoContainer">
            <div className="infoMain">
              <div className="groupIcon">{groupIcon}</div>

              <div className="infos">
                <h2 className="title">{title}</h2>
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
