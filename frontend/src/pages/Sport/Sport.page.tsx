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

import { useSportEventList } from './hooks/useSportEventList';
import { useDayDisplay } from './hooks/useDayDisplay';
import { SportEventCard } from './components/SportEventCard';

export default function SportPage() {
  const { t } = useTranslation();
  const bk = useBreakpoint(500);
  const now = new Date(Date.now());
  const [onlyMyGroups, setOnlyMyGroups] = useState(false);
  const dayDisplay = useDayDisplay();

  now.setHours(0, 0, 0, 0);

  const { query, groupByDay, count } = useSportEventList({
    is_member: onlyMyGroups,
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
              {bk.isLarger && t('event.grid.label')}
            </ToggleButton>

            <ToggleButton value={true} sx={{ gap: 1, pl: 2, pr: 1.5 }}>
              <PersonIcon fontSize="small" />
              {bk.isLarger && t('event.grid.label')}
            </ToggleButton>
          </ToggleButtonGroup>
        </FlexCol>
      </FlexRow>
      <Spacer vertical={2} />
      {(() => {
        if (count === 0) {
          return <Typography>{t('group.list.noGroup')}</Typography>;
        } else {
          return (
            <InfiniteList query={query}>
              {Array.from(groupByDay.entries()).map(([date, sportEvents]) => (
                <div key={date}>
                  <Typography variant="h2">{dayDisplay(date)}</Typography>
                  {sportEvents.map((sportEvent: SportEvent) => (
                    <SportEventCard
                      key={sportEvent.id}
                      sportEvent={sportEvent}
                    />
                  ))}
                </div>
              ))}
            </InfiniteList>
          );
        }
      })()}
      <Spacer vertical={6} />
    </Container>
  );
}
