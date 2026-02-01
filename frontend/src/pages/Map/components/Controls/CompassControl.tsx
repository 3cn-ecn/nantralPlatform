import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';

import { Navigation as NavigationIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function CompassControl() {
  const { t } = useTranslation();
  const { current: mapRef } = useMap();

  const [bearing, setBearing] = useState(0);

  // Listen to map events
  useEffect(() => {
    if (!mapRef) return;
    const updateBearing = () => setBearing(mapRef.getBearing());

    mapRef.on('rotate', updateBearing);
    return () => {
      mapRef.off('rotate', updateBearing);
    };
  }, [mapRef]);

  const handleRotateReset = () => mapRef?.rotateTo(0, { duration: 800 });

  return (
    <Tooltip
      title={t('map.controls.compass')}
      placement={'left'}
      slotProps={{ popper: { disablePortal: true } }}
    >
      <IconButton
        size="small"
        color={bearing !== 0 ? 'secondary' : 'primary'}
        onClick={handleRotateReset}
        sx={{
          transform: `rotate(${-bearing}deg)`,
        }}
      >
        <NavigationIcon />
      </IconButton>
    </Tooltip>
  );
}
