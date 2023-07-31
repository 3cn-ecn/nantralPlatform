import { Share as ShareIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';
import { useShareLink } from '#shared/utils/useShareLink';

type ShareButtonProps = {
  eventId: number;
};

export function ShareButton({ eventId }: ShareButtonProps) {
  const { t } = useTranslation();
  const { shareLink } = useShareLink();

  return (
    <Button
      startIcon={<ShareIcon />}
      variant="outlined"
      color="secondary"
      onClick={() => shareLink(`${window.location.origin}/event/${eventId}`)}
    >
      {t('event.action_menu.share')}
    </Button>
  );
}
