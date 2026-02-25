import { useState } from 'react';

import {
  AdminPanelSettingsRounded,
  Check,
  CheckCircle,
  Edit,
  ExpandMore,
  Lock,
  PersonAddRounded,
} from '@mui/icons-material';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { getMembershipListApi } from '#modules/group/api/getMembershipList.api';
import { Group } from '#modules/group/types/group.types';
import { ModalAdminRequest } from '#modules/group/view/Modal/ModalAdminRequest';
import { ModalEditMembership } from '#modules/group/view/Modal/ModalEditMembership';
import { ModalJoinGroup } from '#modules/group/view/Modal/ModalJoinGroup';
import { useAuth } from '#shared/context/Auth.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export function JoinButton({ group }: { group?: Group }) {
  const { isAuthenticated } = useAuth();
  const user = useCurrentUserData();
  const { t } = useTranslation();
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
    queryFn: () => getMembershipListApi({ group: group?.slug, user: user.id }),
    queryKey: ['membership', { group: group?.slug, user: user.id }],
  });

  const member = memberships?.results?.[0];

  return (
    isAuthenticated &&
    group && (
      <>
        <Button
          startIcon={
            group?.isMember ? (
              <Check />
            ) : group.lockMemberships ? (
              <Lock />
            ) : (
              <PersonAddRounded />
            )
          }
          endIcon={group?.isMember && <ExpandMore />}
          disabled={group.lockMemberships && !group?.isMember}
          variant={group?.isMember ? 'outlined' : 'contained'}
          onClick={handleClick}
        >
          {group?.isMember
            ? t('group.details.member')
            : t('group.details.join')}
        </Button>
        <Menu
          open={open && group.isMember}
          variant="selectedMenu"
          onClose={handleClose}
          anchorEl={anchorEl}
          sx={{ mt: 1 }}
        >
          <MenuItem onClick={() => setJoinModalOpen(true)} sx={{ gap: 1 }}>
            <Edit />
            <Typography>{t('group.details.edit')}</Typography>
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
                  <Typography>{t('group.details.requestSent')}</Typography>
                </>
              ) : (
                <>
                  <AdminPanelSettingsRounded />
                  <Typography>{t('group.details.requestAdmin')}</Typography>
                </>
              )}
            </MenuItem>
          )}
        </Menu>
        {modalOpen && !group?.isMember && (
          <ModalJoinGroup
            group={group}
            user={user}
            onClose={() => setJoinModalOpen(false)}
          />
        )}
        {modalOpen && group?.isMember && member && (
          <ModalEditMembership
            group={group}
            membership={member}
            onClose={() => setJoinModalOpen(false)}
          />
        )}
        {adminRequestModalOpen && member && (
          <ModalAdminRequest
            group={group}
            membership={member}
            onClose={() => setAdminRequestModalOpen(false)}
          />
        )}
      </>
    )
  );
}
