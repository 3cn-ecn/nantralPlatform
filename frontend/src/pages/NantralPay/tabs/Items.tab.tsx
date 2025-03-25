import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { ModalAddItem } from '#modules/nantralpay/view/shared/Modal/ModalAddItem';
import { ItemInfiniteGrid } from '#pages/NantralPay/components/ItemInfiniteGrid';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function ItemsTab() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <FlexRow pb={2} justifyContent={'space-between'} alignItems={'center'}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          {t('group.details.editGroup.add')}
        </Button>
      </FlexRow>
      <ItemInfiniteGrid />
      {open && <ModalAddItem onClose={() => setOpen(false)} />}
    </>
  );
}
