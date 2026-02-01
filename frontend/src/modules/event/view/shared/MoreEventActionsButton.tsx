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
import { useShareLink } from '#shared/hooks/useShareLink';
import { useTranslation } from '#shared/i18n/useTranslation';

import { EditEventModal } from '../Modals/EditEventModal';

interface Action {
  key: string;
  label: string;
  Icon: SvgIconComponent;
  onClick: () => void;
  link?: string;
  hidden?: boolean;
}

interface MoreActionsButtonProps {
  eventId: number;
  isParticipating: boolean;
  isAdmin: boolean;
  sharedUrl: string;
}

export function MoreEventActionsButton({
  eventId,
  isParticipating,
  isAdmin,
  sharedUrl,
}: MoreActionsButtonProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [
    isOpenUnregisterConfirmationModal,
    setIsOpenUnregisterConfirmationModal,
  ] = useState(false);

  const { t } = useTranslation();
  const { shareLink } = useShareLink();
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
      onClick: () => {
        setIsOpenEditModal(true);
        setMenuIsOpen(false);
      },
      hidden: !isAdmin,
    },
    {
      key: 'unregister',
      label: t('event.action_menu.unsubscribe'),
      Icon: CancelIcon,
      onClick: () => {
        setIsOpenUnregisterConfirmationModal(true);
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

      {isOpenUnregisterConfirmationModal && (
        <ConfirmationModal
          title={t('event.participateButton.unregisterModal.title')}
          body={t('event.participateButton.unregisterModal.message')}
          loading={registrationMutation.isPending}
          onCancel={() => setIsOpenUnregisterConfirmationModal(false)}
          onConfirm={() =>
            registrationMutation.unregister({
              onSuccess: () => setIsOpenUnregisterConfirmationModal(false),
            })
          }
        />
      )}

      {isOpenEditModal && (
        <EditEventModal
          eventId={eventId}
          onClose={() => setIsOpenEditModal(false)}
        />
      )}
    </>
  );
}
