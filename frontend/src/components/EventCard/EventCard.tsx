import * as React from 'react';
import './EventCard.scss';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import { EventProps } from 'pages/Props/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import JoinButton from '../Button/JoinButton';

import FavButton from '../Button/FavButton';
import { Margin } from '@mui/icons-material';

const monthNames = [
  'Janvier',
  'Févier',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Sptembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

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
  let minimumWidth = "0px";
  switch (name) {
    case 'date':
      icon = <CalendarTodayIcon className='infoItemElement'/>;
      minimumWidth = "max-content"; // To prevent the date to be displayed on multiple lines.
      break;
    case 'time':
      icon = <AccessTimeIcon className='infoItemElement'/>;
      break;
    case 'position':
      icon = <LocationOnIcon className='infoItemElement'/>;

      break;
    default:
  }
  console.log({minimumWidth})
  return (
    <div className="infoItem">
      {icon}
      <div className="infoItemElement" style={{paddingLeft : "10px", minWidth: minimumWidth}} >{text}</div>
    </div>
  );
}

function EventCard(props: { event: EventProps }) {
  const { event } = props;
  const {
    title,
    number_of_participants,
    max_participant,
    location,
    date,
    image,
    get_group_name,
    is_participating,
    slug,
  } = event;

  const variant = max_participant === null ? 'normal' : 'shotgun';
  const bannerDescription = 'AMOG';

  const dateValue = new Date(date);
  const dateText = `${dateValue.getDate()} ${monthNames[dateValue.getMonth()]} ${dateValue.getFullYear()}`;
  const hourText = `${dateValue.getHours()}:${dateValue.getMinutes()}`;

  const groupIcon =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Aperture_Science_Logo.svg/480px-Aperture_Science_Logo.svg.png';
  return (
    <Card className="eventCard">
      <CardActionArea>
        <CardMedia
          className="banner"
          component="img"
          image={image}
          alt="Banner"
        />
        <FavButton className="favIcon" />
        <CardContent sx={{ padding: 0 }}>
          <div className="infoContainer">
            <div className="infoMain">
              <div>
                <img
                  className="groupIcon"
                  src={groupIcon}
                  alt={bannerDescription}
                />
              </div>

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
                />
              </div>
            </div>
            <div className="infoDetails">
              <InfoItem name="date" value={dateText} />
              <InfoItem name="time" value={hourText} />
              <InfoItem name="position" value={location} />
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default EventCard;
