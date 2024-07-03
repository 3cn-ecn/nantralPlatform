import { useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { ModalEditGroup } from '#modules/group/view/Modal/ModalEditGroup';

export function EditButton({
  group,
  members,
}: {
  group: Group;
  members: Membership[];
}) {
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
        <ModalEditGroup
          group={group}
          members={members}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
