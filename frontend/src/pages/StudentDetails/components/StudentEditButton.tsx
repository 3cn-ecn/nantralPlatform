import { useSearchParams } from 'react-router-dom';

import { Edit } from '@mui/icons-material';
import { Fab } from '@mui/material';

import { User } from '#modules/account/user.types';

import { ModalEditProfile, TabType } from './EditProfile/ModalEditProfile';

interface StudentEditButtonProps {
  user: User;
}

export function StudentEditButton({ user }: StudentEditButtonProps) {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab');
  const open = Boolean(tab && tab in TabType);
  return (
    <>
      <Fab
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => {
          params.set('tab', 'profile');
          setParams(params);
        }}
        color={'primary'}
      >
        <Edit />
      </Fab>
      {open && (
        <ModalEditProfile
          onClose={() => {
            params.delete('tab');
            setParams(params);
          }}
          user={user}
        />
      )}
    </>
  );
}
