import { useState } from 'react';

import {
  AdminPanelSettingsRounded,
  Check,
  CheckCircle,
  Edit,
  ExpandMore,
  PersonAddRounded,
} from '@mui/icons-material';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getMembershipListApi } from '#modules/group/api/getMembershipList.api';
import { Group } from '#modules/group/types/group.types';
import { ModalAdminRequest } from '#modules/group/view/Modal/ModalAdminRequest';
import { ModalEditMembership } from '#modules/group/view/Modal/ModalEditMembership';
import { ModalJoinGroup } from '#modules/group/view/Modal/ModalJoinGroup';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { useAuth } from '#shared/context/Auth.context';

export function JoinButton({ group }: { group?: Group }) {
  const { isAuthenticated } = useAuth();
  const student = useCurrentUserData();
  const [modalOpen, setJoinModalOpen] = useState(false);
  const [adminRequestModalOpen, setAdminRequestModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (group?.isMember) {
      setAnchorEl(event.currentTarget);
      return;
    } else {
      setJoinModalOpen(true);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: memberships } = useQuery({
    queryFn: () =>
      getMembershipListApi({ group: group?.slug, student: student.id }),
    queryKey: ['membership', { group: group?.slug, student: student.id }],
  });

  const member = memberships?.results?.[0];

  return (
    isAuthenticated &&
    group && (
      <>
        <Button
          startIcon={group?.isMember ? <Check /> : <PersonAddRounded />}
          endIcon={group?.isMember && <ExpandMore />}
          disabled={group.lockMemberships}
          variant={group?.isMember ? 'outlined' : 'contained'}
          onClick={handleClick}
        >
          {group?.isMember ? 'Membre' : 'Rejoindre'}
        </Button>
        <Menu
          open={open}
          variant="selectedMenu"
          onClose={handleClose}
          anchorEl={anchorEl}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={() => setJoinModalOpen(true)} sx={{ gap: 1 }}>
            <Edit />
            <Typography>Modifier</Typography>
          </MenuItem>
          {!group.isAdmin && (
            <MenuItem
              sx={{ gap: 1 }}
              disabled={!!member?.adminRequest}
              onClick={() => setAdminRequestModalOpen(true)}
            >
              {member?.adminRequest ? (
                <>
                  <CheckCircle />
                  <Typography>Demande envoyée</Typography>
                </>
              ) : (
                <>
                  <AdminPanelSettingsRounded />
                  <Typography>Demander a être admin</Typography>
                </>
              )}
            </MenuItem>
          )}
        </Menu>
        {modalOpen && !group?.isMember && (
          <ModalJoinGroup
            group={group}
            student={student}
            onClose={() => setJoinModalOpen(false)}
          />
        )}
        {modalOpen && group?.isMember && member && (
          <ModalEditMembership
            membership={member}
            onClose={() => setJoinModalOpen(false)}
          />
        )}
        {adminRequestModalOpen && (
          <ModalAdminRequest
            group={group}
            onClose={() => setAdminRequestModalOpen(false)}
          />
        )}
      </>
    )
  );
}
