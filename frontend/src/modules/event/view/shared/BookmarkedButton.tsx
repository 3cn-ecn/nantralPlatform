import { useState } from 'react';

import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { CircularProgress, IconButton, Tooltip, Zoom } from '@mui/material';

import { useBookmarkMutation } from '#modules/event/hooks/useBookmark.mutation';
import { useTranslation } from '#shared/i18n/useTranslation';

interface BookmarkedButtonProps {
  eventId: number;
  selected: boolean;
}

export function BookmarkedButton({ eventId, selected }: BookmarkedButtonProps) {
  const [fav, setFav] = useState(selected);
  const { t } = useTranslation();

  const { addBookmark, removeBookmark, isPending } =
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
      <IconButton onClick={handlePress} disabled={isPending}>
        <Zoom in={fav}>
          <FavoriteIcon color="primary" sx={{ position: 'absolute' }} />
        </Zoom>
        <FavoriteBorderIcon color="primary" />
        {isPending && (
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
