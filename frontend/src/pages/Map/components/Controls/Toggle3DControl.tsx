import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';

import { IconButton, Tooltip } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function Toggle3DControl() {
  const { t } = useTranslation();
  const { current: mapRef } = useMap();
  const map = mapRef?.getMap();
  const [is3D, setIs3D] = useState(false);
  useEffect(() => {
    if (map) map.setMaxPitch(0);
  }, [map]);

  const handleToggle3D = () => {
    if (!map) return;

    if (!is3D) {
      // allow tilting the map
      map.setMaxPitch(85);

      // Tilt the map for perspective
      map.easeTo({ pitch: 60, duration: 1000 });

      // Add terrain source if not already present
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
      }
      // Enable 3D terrain
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // add 3D buildings
      if (!map.getConfigProperty('basemap', 'show3dObjects')) {
        map.setConfigProperty('basemap', 'show3dObjects', true);
      }

      setIs3D(true);
    } else {
      // reset view
      map.easeTo({ pitch: 0, duration: 1000 });
      // remove ability to tilt the map after 1 sec to ensure the animation has ended
      setTimeout(() => map.setMaxPitch(0), 1000);
      // remove 3D terrain
      map.setTerrain(null);
      // remove 3D buildings
      if (map.getConfigProperty('basemap', 'show3dObjects')) {
        map.setConfigProperty('basemap', 'show3dObjects', false);
      }
      setIs3D(false);
    }
  };
  return (
    <Tooltip
      title={is3D ? t('map.controls.disable3D') : t('map.controls.enable3D')}
      placement={'left'}
      slotProps={{ popper: { disablePortal: true } }}
    >
      <IconButton size="small" color="primary" onClick={handleToggle3D}>
        {is3D ? '2D' : '3D'}
      </IconButton>
    </Tooltip>
  );
}
