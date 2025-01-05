import { useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { ModalEditProfile } from './EditProfile/ModalEditProfile';

export function StudentEditButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Fab
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
      >
        <Edit />
      </Fab>
      {open && <ModalEditProfile onClose={() => setOpen(false)} />}
    </>
  );
}
