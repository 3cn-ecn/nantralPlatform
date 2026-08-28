import { useState } from 'react';

import {
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';

import { SportEvent } from '#modules/event/sportevent.type';
import { useSportEventPeopleList } from '#pages/Sport/hooks/useSportEventPeopleList';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useTranslation } from '#shared/i18n/useTranslation';

type SportEventPeopleTab = 'participants' | 'nonParticipants';

interface SportEventPeopleModalProps {
  sportEvent: SportEvent;
  onClose: () => void;
}

function SportEventPeopleListContent({
  sportEvent,
  tab,
}: {
  sportEvent: SportEvent;
  tab: SportEventPeopleTab;
}) {
  const query = useSportEventPeopleList(sportEvent.id, tab, {
    enabled: true,
  });

  const people = query.data?.pages.flatMap((page) => page.results) ?? [];

  if (query.isLoading && people.length === 0) {
    return (
      <ResponsiveDialogContent>
        <CircularProgress />
      </ResponsiveDialogContent>
    );
  }

  if (query.isError) {
    return (
      <ResponsiveDialogContent>
        <ErrorPageContent
          status={query.error.status}
          errorMessage={query.error.message}
          retryFn={query.refetch}
        />
      </ResponsiveDialogContent>
    );
  }

  const emptyLabel =
    tab === 'participants' ? 'Aucun participant' : 'Aucun non-participant';

  if (people.length === 0) {
    return (
      <ResponsiveDialogContent>
        <Typography>{emptyLabel}</Typography>
      </ResponsiveDialogContent>
    );
  }

  return (
    <ResponsiveDialogContent sx={{ p: 0 }}>
      <InfiniteList query={query}>
        <List>
          {people.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton href={user.url}>
                <ListItemAvatar>
                  <Avatar alt={user.name} src={user.picture} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </InfiniteList>
      {query.isFetchingNextPage && (
        <Typography
          sx={{ px: 2, py: 1 }}
          variant="body2"
          color="text.secondary"
        >
          Chargement...
        </Typography>
      )}
    </ResponsiveDialogContent>
  );
}

export function SportEventPeopleModal({
  sportEvent,
  onClose,
}: Readonly<SportEventPeopleModalProps>) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<SportEventPeopleTab>('participants');

  return (
    <ResponsiveDialog onClose={onClose} maxWidth="sm" scroll="body">
      <ResponsiveDialogHeader onClose={onClose}>
        {t('event.participants.title')}
      </ResponsiveDialogHeader>
      <Tabs
        value={tab}
        onChange={(_event, nextTab) => setTab(nextTab)}
        variant="fullWidth"
      >
        <Tab
          value="participants"
          label={`${t('event.participants.title')} (${sportEvent.participantsCount})`}
        />
        <Tab
          value="nonParticipants"
          label={`Non-participants (${sportEvent.nonParticipantsCount})`}
        />
      </Tabs>
      <SportEventPeopleListContent sportEvent={sportEvent} tab={tab} />
    </ResponsiveDialog>
  );
}
