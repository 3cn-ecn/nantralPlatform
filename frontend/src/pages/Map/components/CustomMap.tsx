import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from 'react-map-gl/mapbox';
import { useSearchParams } from 'react-router-dom';

import { Box, useTheme } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getMapGroupDetailApi } from '#modules/group/api/getMapGroupDetail.api';
import { getMapGroupListPreviewApi } from '#modules/group/api/getMapGroupListPreview.api';
import {
  MapGroupPoint,
  MapGroupPreview,
} from '#modules/group/types/group.types';
import { PopupContent } from '#pages/Map/components/PopupContent';
import { ThemeControl } from '#pages/Map/components/ThemeControl';
import { useChangeThemeMode } from '#shared/context/CustomTheme.context';

import '../styles/custom-mapbox-gl.css';

declare const MAPBOX_TOKEN: string;

export function CustomMap({
  groupType,
  showArchived,
}: {
  groupType?: string;
  showArchived?: boolean;
}) {
  const { currentThemeMode } = useChangeThemeMode();
  const theme = useTheme();
  const [params, setParams] = useSearchParams();
  const [popupInfo, setPopupInfo] = useState<MapGroupPreview | null>(null);
  const [groupList, setGroupList] = useState<MapGroupPoint[]>([]);
  const mapRef = useRef<MapRef>(null);

  const handleOpen = useCallback(
    (groupPoint: MapGroupPoint) => {
      getMapGroupDetailApi(groupPoint.slug).then((group) => {
        setPopupInfo(group);
        params.set('id', group.id.toString());
        setParams(params, { preventScrollReset: true });
        mapRef.current?.flyTo({
          // small bias to ensure that the popup is visible
          center: [group.longitude, group.latitude - 0.0015],
          zoom: 15.5,
          duration: 2000,
        });
      });
    },
    [params, setParams],
  );

  const handleClose = useCallback(() => {
    setPopupInfo(null);
    params.delete('id');
    setParams(params, { preventScrollReset: true });
  }, [params, setParams]);

  useEffect(() => {
    getMapGroupListPreviewApi({
      type: groupType,
      archived: showArchived,
    }).then((groupPage) => {
      setGroupList(groupPage);
      if (params.has('id')) {
        const group = groupPage.find(
          (group) => group.id.toString() === params.get('id'),
        );
        if (group) {
          handleOpen(group);
        } else {
          handleClose();
        }
      }
    });
  }, [groupType, handleClose, handleOpen, params, showArchived]);

  const pins = useMemo(
    () =>
      groupList.map((group) => (
        <Marker
          key={group.id}
          longitude={group.longitude}
          latitude={group.latitude}
          color={theme.palette.primary.main}
          anchor="center"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            handleOpen(group);
          }}
        />
      )),
    [groupList, handleOpen, theme.palette.primary.main],
  );

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: 47.248558,
        longitude: -1.548606,
        zoom: 12,
        bearing: 0,
        pitch: 0,
      }}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ height: '60vh' }}
      mapStyle="mapbox://styles/mapbox/standard"
      config={{
        basemap: {
          lightPreset: currentThemeMode === 'dark' ? 'night' : 'day',
          showPointOfInterestLabels: false,
          show3dObjects: false,
        },
      }}
    >
      <GeolocateControl position="top-left" />
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ThemeControl />
      <ScaleControl />
      {pins}
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="top"
          onClose={handleClose}
          closeButton={false}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                border: '20px solid transparent',
                height: 0,
                width: 0,
                alignSelf: 'center',
                borderBottomColor: theme.palette.background.paper,
                borderTop: 'none',
              }}
            />
            <PopupContent group={popupInfo} onClose={handleClose} />
          </Box>
        </Popup>
      )}
    </Map>
  );
}
