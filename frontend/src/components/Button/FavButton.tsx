import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton/IconButton';
import Zoom from '@mui/material/Zoom/Zoom';
import axios from 'axios';
import { CircularProgress, rgbToHex } from '@mui/material';
import theme from '../../theme';

function FavButton(props: {
  eventSlug: string;
  selected: boolean;
  size?: string;
}) {
  const { eventSlug, selected, size } = props;
  const [fav, setFav] = useState(selected);
  const [loading, setLoading] = useState(false);
  const handlePress = async () => {
    setLoading(true);
    if (fav) {
      axios
        .delete(`/api/event/${eventSlug}/favorite`)
        .then(() => setFav(false))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      axios
        .post(`/api/event/${eventSlug}/favorite`)
        .then(() => setFav(true))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <IconButton
      aria-label="favorite"
      size="large"
      sx={{
        padding: '1.2rem',
        background: rgbToHex(theme.palette.secondary.main).concat('b5'),
        backdropFilter: 'blur(4px)',
        width: `${size}`,
        height: `${size}`,
        fontSize: '1rem',
        '&:hover': {
          background: rgbToHex(theme.palette.primary.main).concat('b5'),
        },
      }}
      onClick={handlePress}
      disabled={loading}
    >
      <Zoom in={fav}>
        <FavoriteIcon
          color="primary"
          sx={{
            position: 'absolute',
            width: `${size}`,
            height: `${size}`,
            fontSize: '1rem',
          }}
        />
      </Zoom>
      <FavoriteBorderIcon
        style={{ width: `${size}`, height: `${size}`, fontSize: '1rem' }}
        color="primary"
      />
      {loading && (
        <CircularProgress size={size} style={{ position: 'absolute' }} />
      )}
    </IconButton>
  );
}

FavButton.defaultProps = {
  size: '1.5625rem',
};

export default FavButton;
