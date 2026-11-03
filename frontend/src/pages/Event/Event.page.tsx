import { Outlet } from 'react-router-dom';

import { Container, Stack, Typography } from '@mui/material';

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
    <Container sx={{ my: 4 }}>
      <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
        <Typography variant="h1" sx={{ flex: 1 }} noWrap>
          {t('event.grid.title')}
        </Typography>
        <ToggleEventViewButton />
      </Stack>
      <Spacer vertical={2} />
      <Outlet />
      <CreateNewEventButton />
      <Spacer vertical={6} />
    </Container>
  );
}
