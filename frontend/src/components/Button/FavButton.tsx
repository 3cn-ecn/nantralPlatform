import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton/IconButton';
import Zoom from '@mui/material/Zoom/Zoom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

function FavButton(props: {
  className: string;
  eventSlug: string;
  selected: boolean;
  size?: string;
}) {
  const { className, eventSlug, selected, size } = props;
  const [fav, setFav] = useState(selected);
  const [loading, setLoading] = useState(false);
  const handlePress = async () => {
    setLoading(true);
    if (fav) {
      axios
        .delete(`api/event/${eventSlug}/favorite`)
        .then(() => setFav(false))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      axios
        .post(`api/event/${eventSlug}/favorite`)
        .then(() => setFav(true))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className={className}>
      <IconButton
        aria-label="favorite"
        size="large"
        style={{
          padding: '0',
          width: `${size}`,
          height: `${size}`,
          fontSize: '1em',
        }}
        onClick={handlePress}
        disabled={loading}
      >
        <Zoom in={fav}>
          <FavoriteIcon
            color="primary"
            style={{
              position: 'absolute',
              width: `${size}`,
              height: `${size}`,
              fontSize: '1em',
            }}
          />
        </Zoom>
        <FavoriteBorderIcon
          style={{ width: `${size}`, height: `${size}`, fontSize: '1em' }}
          color="primary"
        />
        {loading && (
          <CircularProgress size={size} style={{ position: 'absolute' }} />
        )}
      </IconButton>
    </div>
  );
}

FavButton.defaultProps = {
  size: '1.5625em',
};

export default FavButton;
