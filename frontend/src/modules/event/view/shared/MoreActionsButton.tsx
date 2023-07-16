import { useReducer, useState } from 'react';

import {
  Cancel as CancelIcon,
  MoreVert as MoreIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';

import { useRegistrationMutation } from '#modules/event/hooks/useRegistration.mutation';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

type MoreActionsButtonProps = {
  isAdmin: boolean;
  shareUrl: string;
  eventId: number;
  isParticipating: boolean;
};

export function MoreActionsButton({
  isAdmin,
  shareUrl,
  eventId,
  isParticipating,
}: MoreActionsButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenConfirmationModal, toggleConfirmationModal] = useReducer(
    (prev) => !prev,
    false
  );

  const { t } = useTranslation();
  const { showToast } = useToast();
  const registrationMutation = useRegistrationMutation(eventId);

  const menuIsOpen = !!anchorEl;
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-haspopup="true"
        aria-expanded={menuIsOpen ? 'true' : undefined}
        onClick={handleOpenMenu}
      >
        <MoreIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuIsOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            showToast({
              message: t('event.action_menu.linkCopied'),
              variant: 'success',
            });
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText>{t('event.action_menu.share')}</ListItemText>
        </MenuItem>
        {/* {isAdmin && (
          <MenuItem
            component={Link}
            to={`/event/${eventId}/edit`}
            reloadDocument
            onClick={() => handleCloseMenu()}
          >
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText>{t('event.action_menu.edit')}</ListItemText>
          </MenuItem>
        )} */}
        {isParticipating && (
          <MenuItem
            onClick={() => {
              toggleConfirmationModal();
              handleCloseMenu();
            }}
          >
            <ListItemIcon>
              <CancelIcon />
            </ListItemIcon>
            <ListItemText>{t('event.action_menu.unsubscribe')}</ListItemText>
          </MenuItem>
        )}
      </Menu>
      {isOpenConfirmationModal && (
        <ConfirmationModal
          title={t('event.participateButton.unregisterModal.title')}
          body={t('event.participateButton.unregisterModal.message')}
          loading={registrationMutation.isLoading}
          onClose={toggleConfirmationModal}
          onValidCallback={() =>
            registrationMutation.unregister({
              onSuccess: toggleConfirmationModal,
            })
          }
        />
      )}
    </>
  );
}
