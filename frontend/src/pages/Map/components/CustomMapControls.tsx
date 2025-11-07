import { Paper, Stack } from '@mui/material';

import { CompassControl } from '#pages/Map/components/Controls/CompassControl';
import { FullscreenControl } from '#pages/Map/components/Controls/FullscreenControl';
import { LocationControl } from '#pages/Map/components/Controls/LocationControl';
import { Toggle3DControl } from '#pages/Map/components/Controls/Toggle3DControl';
import { ZoomControls } from '#pages/Map/components/Controls/ZoomControls';

export function CustomMapControls({
  portalContainer,
}: {
  portalContainer?: HTMLElement | null;
}) {
  return (
    <Paper sx={{ p: 1, alignSelf: 'start' }}>
      <Stack spacing={1}>
        <ZoomControls portalContainer={portalContainer} />
        <CompassControl portalContainer={portalContainer} />
        <LocationControl portalContainer={portalContainer} />
        <Toggle3DControl portalContainer={portalContainer} />
        <FullscreenControl portalContainer={portalContainer} />
      </Stack>
    </Paper>
  );
}
