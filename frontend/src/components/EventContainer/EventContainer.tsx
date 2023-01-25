import * as React from 'react';
import './EventContainer.scss';
import { EventProps } from 'pages/Props/Event';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import JoinButton from '../Button/JoinButton';

import FavButton from '../Button/FavButton';

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

interface EventContainerProps {
  banner?: string;
  groupIcon?: string;
  bannerDescription?: string;
  variant?: 'shotgun' | 'normal' | 'form';
}

function InfoItem(props: { name: string; value: string }) {
  let icon = null;
  const { name, value } = props;
  let text = value;
  let dateText: Date = null;
  switch (name) {
    case 'date':
      icon = <CalendarTodayIcon />;
      dateText = new Date(value);
      text = `${dateText.getDate()} ${monthNames[dateText.getMonth()]} ${dateText.getFullYear()}`;
      break;
    case 'time':
      icon = <AccessTimeIcon />;
      dateText = new Date(value);
      text = `${dateText.getHours()}:${dateText.getMinutes()}`;
      break;
    case 'position':
      icon = <LocationOnIcon />;
      
      break;
    default:
  }
  return (
    <div className='infoItem'>
      {icon}
      <div className='infoItemText'>
      {text}
      </div>
      
    </div>
  );
}

function EventContainer(props: { event: EventProps }) {
  const { event } = props;
  const {
    title,
    number_of_participants,
    max_participant,
    location,
    date,
    image,
    get_group_name,
  } = event;
  const variant = max_participant === null ? 'normal' : 'shotgun';
  const bannerDescription = 'AMOG';

  const groupIcon =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Aperture_Science_Logo.svg/480px-Aperture_Science_Logo.svg.png';
  return (
    <div className="eventContainer">
      <div className="topContainer">
        <img className="eventBanner" src={image} alt={bannerDescription} />
        <FavButton className="favIcon" />
      </div>
      <div className="bottomContainer">
        <div className='infoContainer'>
          <div className="infoMain">
            <div className='iconContainer'>
              <img className="groupIcon" src={groupIcon} alt={bannerDescription} />
            </div>
              
            
            <div className="infos">
              <h2 className="title">{title}</h2>
              <div>{get_group_name}</div>
            </div>
            <div className="joinButton">
          <JoinButton
            variant={variant}
            person={number_of_participants}
            participating={false}
          />
        </div>
              
          </div>
          <div className='infoDetails'>
            <InfoItem name="date" value={date}/>
            <InfoItem name="time" value={date}/>
            <InfoItem name="position" value={location}/>
          </div>
        </div>
        

        
      </div>
    </div>
    );
}

EventContainer.defaultProps = {
  banner:
    'https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png',
  groupIcon:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Aperture_Science_Logo.svg/480px-Aperture_Science_Logo.svg.png',
  bannerDescription: 'Banner',
  variant: 'normal',
};

export default EventContainer;
