import { useEffect, useRef, useState } from 'react';
import { Marker, useMap } from 'react-map-gl/mapbox';

import {
  GpsFixed as GpsFixedIcon,
  GpsNotFixed as GpsNotFixedIcon,
} from '@mui/icons-material';
import { CircularProgress, IconButton, Tooltip, useTheme } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function LocationControl({
  portalContainer,
}: {
  portalContainer?: HTMLElement | null;
}) {
  const { t } = useTranslation();
  const { current: mapRef } = useMap();
  const theme = useTheme();

  const [isLocating, setIsLocating] = useState(false);
  const [followPosition, setFollowPosition] = useState(false);
  const [userPosition, setUserPosition] =
    useState<null | GeolocationCoordinates>(null);
  const watchIdRef = useRef<null | number>(null);

  const handleSuccess = (pos) => {
    const coords = pos.coords;
    setUserPosition(coords);
    mapRef?.flyTo({
      center: [coords.longitude, coords.latitude],
      zoom: 14,
    });
    setIsLocating(false);
    setFollowPosition(true);
  };

  const handleError = (err) => {
    console.error('Geolocation error:', err);
    setIsLocating(false);
    setFollowPosition(false);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;

    // Stop previous watch if any
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (followPosition) {
      setFollowPosition(false);
      return;
    }

    setIsLocating(true);
    // force updating the position (to trigger setIsLocating(false))
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });

    // Start watching user position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  };

  useEffect(() => {
    return () => {
      setFollowPosition(false);
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <>
      {userPosition && (
        <Marker
          longitude={userPosition.longitude}
          latitude={userPosition.latitude}
          altitude={
            userPosition.altitude === null ? undefined : userPosition.altitude
          }
          anchor="center"
        >
          <GpsFixedIcon
            sx={{
              color: theme.palette.info.main,
              fontSize: 32,
            }}
          />
        </Marker>
      )}
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
          onClick={handleLocate}
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
    </>
  );
}
