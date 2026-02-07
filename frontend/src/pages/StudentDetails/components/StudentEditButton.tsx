import { useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { Student } from '#modules/student/student.types';

import { ModalEditProfile } from './EditProfile/ModalEditProfile';

interface StudentEditButtonProps {
  student: Student;
}

export function StudentEditButton({ student }: StudentEditButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Fab
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
        color={'primary'}
      >
        <Edit />
      </Fab>
      {open && (
        <ModalEditProfile onClose={() => setOpen(false)} student={student} />
      )}
    </>
  );
}
