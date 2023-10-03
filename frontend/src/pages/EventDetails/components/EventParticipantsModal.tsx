import {
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { Event } from '#modules/event/event.type';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useTranslation } from '#shared/i18n/useTranslation';

import { useParticipantList } from '../hooks/useParticipantList.query';

interface EventParticipantsModalProps {
  event: Event;
  onClose: () => void;
}

export function EventParticipantsModal({
  event,
  onClose,
}: EventParticipantsModalProps) {
  const { t } = useTranslation();
  const participantsQuery = useParticipantList(event.id);

  if (participantsQuery.isLoading) {
    return (
      <ResponsiveDialog onClose={onClose} maxWidth="xs">
        <ResponsiveDialogHeader onClose={onClose}>
          {t('event.participants.title')}
        </ResponsiveDialogHeader>
        <FlexRow
          justifyContent="center"
          alignItems="center"
          sx={{ p: 9, pt: 0, height: '100%' }}
        >
          <CircularProgress />
        </FlexRow>
      </ResponsiveDialog>
    );
  }

  if (participantsQuery.isError) {
    return (
      <ResponsiveDialog onClose={onClose} maxWidth="xs">
        <ResponsiveDialogHeader onClose={onClose}>
          {t('event.participants.title')}
        </ResponsiveDialogHeader>
        <ResponsiveDialogContent>
          <ErrorPageContent
            status={participantsQuery.error.status}
            errorMessage={participantsQuery.error.message}
            retryFn={participantsQuery.refetch}
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  }

  const participants = participantsQuery.data.results;
  const numberOfParticipants = participantsQuery.data.count;

  if (numberOfParticipants === 0) {
    return (
      <ResponsiveDialog onClose={onClose} maxWidth="xs">
        <ResponsiveDialogHeader onClose={onClose}>
          {t('event.participants.title')}
        </ResponsiveDialogHeader>
        <ResponsiveDialogContent>
          <Typography>{t('event.participants.noParticipants')}</Typography>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  }

  return (
    <ResponsiveDialog onClose={onClose} maxWidth="xs">
      <ResponsiveDialogHeader onClose={onClose}>
        {event.maxParticipant
          ? t('event.participants.titleWithMax', {
              number: numberOfParticipants,
              max: event.maxParticipant,
            })
          : t('event.participants.titleWithNumber', {
              number: numberOfParticipants,
            })}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent sx={{ p: 0 }}>
        <List>
          {participants.map((student) => (
            <ListItem key={student.id} disablePadding>
              <ListItemButton href={student.url}>
                <ListItemAvatar>
                  <Avatar alt={student.name} src={student.picture} />
                </ListItemAvatar>
                <ListItemText>{student.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
