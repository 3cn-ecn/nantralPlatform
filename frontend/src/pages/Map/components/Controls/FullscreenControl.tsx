import { useEffect, useState } from 'react';
import { useMap } from 'react-map-gl/mapbox';

import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function FullscreenControl() {
  const { t } = useTranslation();
  const { current: mapRef } = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleFullscreen = () => {
    const container = mapRef?.getContainer();
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <Tooltip
      title={
        isFullscreen
          ? t('map.controls.exitFullscreen')
          : t('map.controls.fullscreen')
      }
      placement={'left'}
      slotProps={{ popper: { disablePortal: true } }}
    >
      <IconButton size="small" color="primary" onClick={handleFullscreen}>
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  );
}
