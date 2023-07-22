import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Cancel as CancelIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  SvgIconComponent,
} from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';

import { useRegistrationMutation } from '#modules/event/hooks/useRegistration.mutation';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { MoreActionsButton } from '#shared/components/MoreActionsButton/MoreActionsButton';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { useShareLink } from '#shared/utils/useShareLink';

type Action = {
  key: string;
  label: string;
  Icon: SvgIconComponent;
  onClick: () => void;
  link?: string;
  hidden?: boolean;
};

type MoreActionsButtonProps = {
  eventId: number;
  isParticipating: boolean;
  isAdmin: boolean;
  sharedUrl: string;
};

export function MoreEventActionsButton({
  eventId,
  isParticipating,
  isAdmin,
  sharedUrl,
}: MoreActionsButtonProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  const { t } = useTranslation();
  const { shareLink } = useShareLink();
  const showToast = useToast();
  const registrationMutation = useRegistrationMutation(eventId);

  const actions: Action[] = [
    {
      key: 'share',
      label: t('event.action_menu.share'),
      Icon: ShareIcon,
      onClick: () => {
        shareLink(sharedUrl);
        setMenuIsOpen(false);
      },
    },
    {
      key: 'edit',
      label: t('event.action_menu.edit'),
      Icon: EditIcon,
      onClick: () =>
        showToast({ message: 'Not yet implemented...', variant: 'warning' }),
      // link: `/event/${eventId}/edit/`,
      hidden: !isAdmin,
    },
    {
      key: 'unregister',
      label: t('event.action_menu.unsubscribe'),
      Icon: CancelIcon,
      onClick: () => {
        setIsOpenConfirmationModal(true);
        setMenuIsOpen(false);
      },
      hidden: !isParticipating,
    },
  ];

  return (
    <>
      <MoreActionsButton
        menuIsOpen={menuIsOpen}
        setMenuIsOpen={setMenuIsOpen}
        menuPosition="top-left"
      >
        {actions
          .filter((action) => !action.hidden)
          .map((action) => (
            <MenuItem
              key={action.key}
              onClick={action.onClick}
              {...(action.link ? { component: Link, to: action.link } : {})}
            >
              <ListItemIcon>
                <action.Icon />
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          ))}
      </MoreActionsButton>

      {isOpenConfirmationModal && (
        <ConfirmationModal
          title={t('event.participateButton.unregisterModal.title')}
          body={t('event.participateButton.unregisterModal.message')}
          loading={registrationMutation.isLoading}
          onCancel={() => setIsOpenConfirmationModal(false)}
          onConfirm={() =>
            registrationMutation.unregister({
              onSuccess: () => setIsOpenConfirmationModal(false),
            })
          }
        />
      )}
    </>
  );
}
