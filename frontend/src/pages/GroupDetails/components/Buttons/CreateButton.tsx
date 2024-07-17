import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function CreateButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Button variant="contained" startIcon={<Add />} onClick={onClick}>
      {t('group.details.create')}
    </Button>
  );
}
