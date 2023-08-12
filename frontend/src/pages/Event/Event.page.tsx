import { Outlet } from 'react-router-dom';

import { Container, Typography } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CreateNewEventButton } from './shared/CreateNewEventButton';
import { ToggleEventViewButton } from './shared/ToggleEventViewButton';

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
export default function EventPage() {
  const { t } = useTranslation();

  return (
    <PageTemplate>
      <Container sx={{ my: 4 }}>
        <FlexRow gap={1}>
          <Typography variant="h1" flex={1} noWrap>
            {t('event.grid.title')}
          </Typography>
          <ToggleEventViewButton />
        </FlexRow>
        <Spacer vertical={2} />
        <Outlet />
        <CreateNewEventButton />
        <Spacer vertical={6} />
      </Container>
    </PageTemplate>
  );
}
