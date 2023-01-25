import * as React from 'react';
import './EventContainer.scss';
import JoinButton from '../Button/JoinButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface EventContainerProps {
  banner?: string;
  groupIcon?: string;
  bannerDescription?: string;
  variant?: 'shotgun' | 'normal' | 'form';
}

function EventContainer({ variant, banner, groupIcon, bannerDescription }: EventContainerProps) {
  return (
    <div className="eventContainer">
      <div className='topContainer'>
        <img className="eventBanner" src={banner} alt={bannerDescription} />
        <FavoriteBorderIcon className='favIcon' color="primary" />
      </div>
      <div className='bottomContainer'>
        <h2 className='title'>Ceci est un titre 🐺</h2>
        <div className="infoContainer">
          <img className="groupIcon" src={groupIcon} alt={bannerDescription} />
          <div className='infos'>
            Ceci est une courte description.<br/>
            <i>31 Février à 25h30</i>
          </div>
        </div>
        
        <div className="joinButton">
          <JoinButton variant={variant} />
        </div>
      </div>
    </div>
  );
}

EventContainer.defaultProps = {
  banner: 'https://upload.wikimedia.org/wikipedia/en/2/27/Bliss_%28Windows_XP%29.png',
  groupIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Aperture_Science_Logo.svg/480px-Aperture_Science_Logo.svg.png",
  bannerDescription: 'Banner',
  variant: 'normal',
};

export default EventContainer;
