import { useState } from 'react';

import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { ModalAddMember } from '#modules/group/view/Modal/ModalAddMember';

export function AddMemberButton({ group }: { group: Group }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setModalOpen(true)}
      >
        Ajouter
      </Button>
      {modalOpen && (
        <ModalAddMember onClose={() => setModalOpen(false)} group={group} />
      )}
    </>
  );
}
