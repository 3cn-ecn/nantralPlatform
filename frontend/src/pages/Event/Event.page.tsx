import { Outlet } from 'react-router-dom';

import { Container, Typography } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CreateNewEventButton } from './components/CreateNewEventButton';
import { ToggleEventViewButton } from './components/ToggleEventViewButton';

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
export default function Event() {
  const { t } = useTranslation();

  return (
    <Container sx={{ my: 4 }}>
      <FlexRow justifyContent="space-between" flexWrap="wrap" gap={1}>
        <Typography variant="h1">{t('event.grid.title')}</Typography>
        <ToggleEventViewButton />
      </FlexRow>
      <Outlet />
      <CreateNewEventButton />
      <Spacer vertical={6} />
    </Container>
  );
}
