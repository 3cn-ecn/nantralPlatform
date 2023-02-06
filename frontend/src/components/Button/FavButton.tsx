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
}) {
  const { className, eventSlug, selected } = props;
  const [fav, setFav] = useState(selected);
  const [loading, setLoading] = useState(false);
  const handlePress = async () => {
    setLoading(true);
    if (fav) {
      axios
        .delete(`api/event/${eventSlug}/favorite`)
        .then((res) => setFav(false))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      axios
        .post(`api/event/${eventSlug}/favorite`)
        .then((res) => setFav(true))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  const icon = fav ? (
    <FavoriteIcon color="primary" />
  ) : (
    <FavoriteBorderIcon color="primary" />
  );
  return (
    <div className={className}>
      <Zoom in={fav}>
        <FavoriteIcon color="primary" style={{ position: 'absolute' }} />
      </Zoom>

      <IconButton
        aria-label="favorite"
        size="large"
        style={{ padding: '0px' }}
        onClick={handlePress}
        disabled={loading}
      >
        <FavoriteBorderIcon color="primary" />
        {loading && (
          <CircularProgress size={25} style={{ position: 'absolute' }} />
        )}
      </IconButton>
    </div>
  );
}

export default FavButton;
