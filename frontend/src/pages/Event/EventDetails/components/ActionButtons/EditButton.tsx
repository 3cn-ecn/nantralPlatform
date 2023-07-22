import { Edit as EditIcon } from '@mui/icons-material';
import { Button } from '@mui/material';

import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export function EditButton() {
  const { t } = useTranslation();
  const showToast = useToast();

  return (
    <Button
      startIcon={<EditIcon />}
      variant="outlined"
      color="secondary"
      onClick={() =>
        showToast({
          message: 'Not yet implemented...',
          variant: 'warning',
        })
      }
    >
      {t('event.action_menu.edit')}
    </Button>
  );
}
