import { useState } from 'react';

import {
  Groups as GroupsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { SportEvent } from '#modules/event/sportevent.type';
import { FlexRow, FlexCol } from '#shared/components/FlexBox/FlexBox';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

import { SportEventCard } from './components/SportEventCard';
import { SportEventCardCreate } from './components/SportEventCardCreate';
import { useDayDisplay } from './hooks/useDayDisplay';
import { useSportEventList } from './hooks/useSportEventList';

export default function SportPage() {
  const { t } = useTranslation();
  const bk = useBreakpoint(500);
  const now = new Date(Date.now());
  const [onlyMyGroups, setOnlyMyGroups] = useState(false);
  const dayDisplay = useDayDisplay();

  now.setHours(0, 0, 0, 0);

  const { query, groupByDay, count } = useSportEventList({
    is_member: onlyMyGroups ? true : undefined,
    fromDate: now.toISOString(),
  });

  return (
    <Container sx={{ my: 4 }}>
      <FlexRow gap={1}>
        <Typography variant="h1" flex={1} noWrap>
          {t('sport.pageTitle')}
        </Typography>
        <FlexCol justifyContent="center">
          <ToggleButtonGroup
            size={bk.isSmaller ? 'medium' : 'small'}
            exclusive
            color="primary"
            value={onlyMyGroups}
            onChange={(_e, value) => setOnlyMyGroups(value ?? false)}
          >
            <ToggleButton value={false} sx={{ gap: 1, pl: 2, pr: 1.5 }}>
              <GroupsIcon fontSize="small" />
              {bk.isLarger && t('sport.filters.allClubs')}
            </ToggleButton>

            <ToggleButton value={true} sx={{ gap: 1, pl: 2, pr: 1.5 }}>
              <PersonIcon fontSize="small" />
              {bk.isLarger && t('sport.filters.myClubsOnly')}
            </ToggleButton>
          </ToggleButtonGroup>
        </FlexCol>
      </FlexRow>
      <Typography variant="body2" color="text.secondary">
        {t('sport.membership_reminder')}
      </Typography>
      <Spacer vertical={2} />
      <Spacer vertical={2} />
      {count === 0 && <Typography>{t('sport.noEvents')}</Typography>}
      <InfiniteList query={query}>
        {Array.from(groupByDay.entries()).map(([groupKey, sportEvents]) => (
          <div key={groupKey}>
            <Typography variant="h2">
              {dayDisplay(groupKey, sportEvents[0]?.date)}
            </Typography>
            <Spacer vertical={1} />
            <FlexRow gap={2} flexWrap="wrap">
              {sportEvents.map((sportEvent: SportEvent) => (
                <SportEventCard key={sportEvent.id} sportEvent={sportEvent} />
              ))}
              <SportEventCardCreate />
            </FlexRow>
            <Spacer vertical={2} />
          </div>
        ))}
      </InfiniteList>
      <Spacer vertical={6} />
    </Container>
  );
}
