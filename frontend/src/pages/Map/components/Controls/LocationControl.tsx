import { useRef, useState } from 'react';
import { GeolocateControl } from 'react-map-gl/mapbox';

import {
  GpsFixed as GpsFixedIcon,
  GpsNotFixed as GpsNotFixedIcon,
} from '@mui/icons-material';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import type { GeolocateControl as GeolocateControlType } from 'mapbox-gl';

import { useTranslation } from '#shared/i18n/useTranslation';

export function LocationControl({
  portalContainer,
}: {
  portalContainer?: HTMLElement | null;
}) {
  const { t } = useTranslation();
  const geoControlRef = useRef<GeolocateControlType>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [followPosition, setFollowPosition] = useState(false);

  return (
    <>
      <Tooltip
        title={
          followPosition
            ? t('map.controls.stopFollowPosition')
            : t('map.controls.followPosition')
        }
        placement={'left'}
        PopperProps={{ container: portalContainer }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setIsLocating(true);
            geoControlRef.current?.trigger();
          }}
          disabled={isLocating}
        >
          {isLocating ? (
            <CircularProgress size={20} color="inherit" />
          ) : followPosition ? (
            <GpsFixedIcon />
          ) : (
            <GpsNotFixedIcon />
          )}
        </IconButton>
      </Tooltip>
      <GeolocateControl
        ref={geoControlRef}
        trackUserLocation
        showUserHeading
        onGeolocate={() => isLocating && setIsLocating(false)}
        onTrackUserLocationStart={() => setFollowPosition(true)}
        onTrackUserLocationEnd={() => {
          setFollowPosition(false);
          setIsLocating(false);
        }}
        style={{ display: 'none' }} // hide the control to use our custom one
      />
    </>
  );
}
