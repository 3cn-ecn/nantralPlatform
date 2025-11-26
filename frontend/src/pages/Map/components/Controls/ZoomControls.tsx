import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';

import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function ZoomControls() {
  const { current: mapRef } = useMap();
  const [zoom, setZoom] = useState(13);
  const { t } = useTranslation();

  useEffect(() => {
    if (!mapRef) return;
    const updateZoom = () => setZoom(mapRef.getZoom());
    mapRef.on('zoom', updateZoom);
    return () => {
      mapRef.off('zoom', updateZoom);
    };
  }, [mapRef]);

  const handleZoomIn = () => mapRef?.zoomIn();
  const handleZoomOut = () => mapRef?.zoomOut();
  return (
    <>
      {/* Zoom In */}
      <Tooltip
        title={t('map.controls.zoomIn')}
        placement={'left'}
        slotProps={{ popper: { disablePortal: true } }}
      >
        <IconButton
          size="small"
          color="primary"
          disabled={mapRef && zoom >= mapRef.getMaxZoom() - 0.1}
          onClick={handleZoomIn}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>

      {/* Zoom Out */}
      <Tooltip
        title={t('map.controls.zoomOut')}
        placement={'left'}
        slotProps={{ popper: { disablePortal: true } }}
      >
        <IconButton
          size="small"
          color="primary"
          disabled={mapRef && zoom <= mapRef.getMinZoom() + 0.1}
          onClick={handleZoomOut}
        >
          <RemoveIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
