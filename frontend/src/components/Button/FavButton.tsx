import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton/IconButton';
import Zoom from '@mui/material/Zoom/Zoom';
import axios from 'axios';
import { Button, CircularProgress, rgbToHex } from '@mui/material';
import { useTranslation } from 'react-i18next';
import theme from '../../theme';

function FavButton(props: {
  eventId: number;
  selected: boolean;
  iconized?: boolean;
  size?: string;
}) {
  const { eventId, selected, size, iconized } = props;
  const [fav, setFav] = useState(selected);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('translation');
  const handlePress = async () => {
    setLoading(true);
    if (fav) {
      axios
        .delete(`/api/event/${eventId}/favorite`)
        .then(() => setFav(false))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      axios
        .post(`/api/event/${eventId}/favorite`)
        .then(() => setFav(true))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  };
  const icon = (
    <>
      <Zoom in={fav}>
        <FavoriteIcon
          color="primary"
          sx={{
            position: 'absolute',
            width: iconized ? `${size}` : '1.25rem',
            height: iconized ? `${size}` : '1.25rem',
          }}
        />
      </Zoom>
      <FavoriteBorderIcon
        style={{
          width: iconized ? `${size}` : '1.25rem',
          height: iconized ? `${size}` : '1.25rem',
        }}
        color="primary"
      />
    </>
  );
  if (iconized) {
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
        {icon}
        {loading && (
          <CircularProgress size={size} style={{ position: 'absolute' }} />
        )}
      </IconButton>
    );
  }
  return (
    <Button
      onClick={handlePress}
      disabled={loading}
      variant="outlined"
      startIcon={
        <div style={{ fontSize: '1rem', maxHeight: '1.25rem' }}>{icon}</div>
      }
    >
      {t('button.like')}
    </Button>
  );
}

FavButton.defaultProps = {
  size: '1.5625rem',
  iconized: false,
};

export default FavButton;
