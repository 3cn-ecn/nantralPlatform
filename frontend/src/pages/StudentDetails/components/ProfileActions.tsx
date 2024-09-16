import { useState } from 'react';

import { Password } from '@mui/icons-material';
import { Button } from '@mui/material';

import { FlexAuto } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ModalChangePassword } from './ChangePasswordModal';

export function ProfileActions() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <FlexAuto gap={2} my={2}>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<Password />}
        >
          {t('student.details.changePassword')}
        </Button>
      </FlexAuto>
      {open && <ModalChangePassword onClose={() => setOpen(false)} />}
    </>
  );
}
