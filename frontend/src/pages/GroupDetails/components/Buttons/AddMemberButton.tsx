import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { ModalAddMember } from '#modules/group/view/Modal/ModalAddMember';
import { useTranslation } from '#shared/i18n/useTranslation';

export function AddMemberButton({ group }: { group: Group }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setModalOpen(true)}
      >
        {t('group.details.editGroup.add')}
      </Button>
      {modalOpen && (
        <ModalAddMember onClose={() => setModalOpen(false)} group={group} />
      )}
    </>
  );
}
