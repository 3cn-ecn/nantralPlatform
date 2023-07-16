import { useState } from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { CircularProgress, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton/IconButton';
import Zoom from '@mui/material/Zoom/Zoom';

import { useBookmarkMutation } from '#modules/event/hooks/useBookmark.mutation';
import { useTranslation } from '#shared/i18n/useTranslation';

type BookmarkedButtonProps = {
  eventId: number;
  selected: boolean;
};

export function BookmarkedButton({ eventId, selected }: BookmarkedButtonProps) {
  const [fav, setFav] = useState(selected);
  const { t } = useTranslation();

  const { addBookmark, removeBookmark, isLoading } =
    useBookmarkMutation(eventId);

  const handlePress = async () => {
    if (fav) {
      removeBookmark({ onSuccess: () => setFav(false) });
    } else {
      addBookmark({ onSuccess: () => setFav(true) });
    }
  };

  return (
    <Tooltip
      title={
        fav
          ? t('event.bookmarkButton.tooltip.remove')
          : t('event.bookmarkButton.tooltip.add')
      }
      aria-label={t('event.bookmarkButton.label')}
      aria-checked={fav}
    >
      <IconButton onClick={handlePress} disabled={isLoading}>
        <Zoom in={fav}>
          <FavoriteIcon color="primary" sx={{ position: 'absolute' }} />
        </Zoom>
        <FavoriteBorderIcon color="primary" />
        {isLoading && (
          <CircularProgress
            color="secondary"
            size="85%"
            thickness={3}
            sx={{ position: 'absolute' }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
}
