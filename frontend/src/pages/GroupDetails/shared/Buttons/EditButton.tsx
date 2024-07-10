import { useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { ModalEditGroup } from '#modules/group/view/Modal/ModalEditGroup';

export function EditButton({ group }: { group: Group }) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Fab
        onClick={() => setModalOpen(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <Edit />
      </Fab>
      {modalOpen && (
        <ModalEditGroup group={group} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
