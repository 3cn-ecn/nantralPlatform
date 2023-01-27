import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton/IconButton';
import Zoom from '@mui/material/Zoom/Zoom';

function FavButton(props: { className: string }) {
  const [fav, setFav] = useState(false);
  const { className } = props;
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
        onClick={() => setFav(!fav)}
      >
        <FavoriteBorderIcon color="primary" />
      </IconButton>
    </div>
  );
}

export default FavButton;
