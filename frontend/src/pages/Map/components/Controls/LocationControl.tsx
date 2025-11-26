import { useRef, useState } from 'react';
import { GeolocateControl } from 'react-map-gl/mapbox';

import {
  GpsFixed as GpsFixedIcon,
  GpsNotFixed as GpsNotFixedIcon,
} from '@mui/icons-material';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import type { GeolocateControl as GeolocateControlType } from 'mapbox-gl';

import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export function LocationControl() {
  const { t } = useTranslation();
  const showToast = useToast();
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
        slotProps={{ popper: { disablePortal: true } }}
      >
        {/* use `span` because of disabled button and tooltip */}
        <span>
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              if (geoControlRef.current?._lastKnownPosition === undefined)
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
        </span>
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
        onError={(err) => {
          setIsLocating(false);
          setFollowPosition(false);
          showToast({
            variant: 'error',
            message:
              err.code === err.PERMISSION_DENIED
                ? t('map.controls.permissionDenied')
                : err.code === err.POSITION_UNAVAILABLE
                  ? t('map.controls.positionUnavailable')
                  : t('map.controls.timeout'),
          });
        }}
        style={{ display: 'none' }} // hide the control to use our custom one
      />
    </>
  );
}
