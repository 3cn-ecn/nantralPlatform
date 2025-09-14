import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  MapRef,
  NavigationControl,
  Popup,
  ScaleControl,
} from 'react-map-gl/mapbox';
import { useSearchParams } from 'react-router-dom';

import { Box, useTheme } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getMapGroupDetailApi } from '#modules/group/api/getMapGroupDetail.api';
import { getMapGroupListPreviewApi } from '#modules/group/api/getMapGroupListPreview.api';
import { MapGroupPreview } from '#modules/group/types/group.types';
import { PopupContent } from '#pages/Map/components/PopupContent';
import { useChangeThemeMode } from '#shared/context/CustomTheme.context';

import '../styles/custom-mapbox-gl.css';
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from './layers';

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
  const mapRef = useRef<MapRef>(null);

  const groupListQuery = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getMapGroupListPreviewApi({
        type: groupType,
        archived: showArchived,
        pageSize: 30,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['map', { groupType, showArchived }],
  });

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setConfigProperty(
      'basemap',
      'lightPreset',
      currentThemeMode === 'dark' ? 'night' : 'day',
    );
  }, [currentThemeMode, mapRef]);

  useEffect(() => {
    if (groupListQuery.isSuccess && groupListQuery.hasNextPage) {
      groupListQuery.fetchNextPage();
    }
  }, [groupListQuery]);

  const handleOpen = useCallback(
    (groupPoint: string) => {
      getMapGroupDetailApi(groupPoint).then((group) => {
        setPopupInfo(group);
        params.set('id', group.id.toString());
        setParams(params, { preventScrollReset: true });
        mapRef.current?.flyTo({
          // small bias to ensure that the popup is visible
          center: [group.longitude, group.latitude - 0.0005],
          zoom: 16.5,
          duration: 500,
        });
      });
    },
    [params, setParams],
  );

  const handleClose = () => {
    setPopupInfo(null);
    params.delete('id');
    setParams(params, { preventScrollReset: true });
  };

  useEffect(() => {
    if (params.has('id')) {
      const group = groupListQuery.data?.pages
        .flatMap((page) => page.results)
        .find((group) => group.id.toString() === params.get('id'));
      if (group) {
        handleOpen(group.slug);
      }
    }
  }, [groupListQuery.data?.pages, handleOpen, params]);

  const points: GeoJSON.Feature[] =
    useMemo(
      () =>
        groupListQuery.data?.pages
          .flatMap((page) => page.results)
          .map((group) => ({
            type: 'Feature',
            properties: {
              cluster: false,
              groupId: group.id,
              slug: group.slug,
              category: 'group',
            },
            geometry: {
              type: 'Point',
              coordinates: [group.longitude, group.latitude],
            },
          })),
      [groupListQuery.data?.pages],
    ) ?? [];

  const onClick = (event) => {
    const feature = event?.features?.[0];
    if (feature?.properties?.point_count) {
      const clusterId = feature?.properties?.cluster_id;

      const mapboxSource = mapRef.current?.getSource('groups') as GeoJSONSource;

      mapboxSource?.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current?.flyTo({
          center: feature.geometry.coordinates,
          zoom: zoom ? zoom + 0.01 : undefined,
          duration: 500,
        });
      });
    } else if (feature?.properties?.slug) {
      handleOpen(feature.properties.slug);
    }
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: 47.21789054262203,
        longitude: -1.5559043178340437,
        zoom: 11.5,
        bearing: 0,
        pitch: 0,
      }}
      onLoad={(event) => {
        event.target.loadImage('/static/img/marker.png', (error, result) => {
          if (error || !result) {
            console.error(error);
            return;
          }
          event.target.addImage('marker', result);
        });

        event.target.addSource('groups', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: points },
          cluster: true,
          clusterMaxZoom: 16,
          clusterRadius: 30,
        });

        event.target.addLayer(clusterLayer);
        event.target.addLayer(clusterCountLayer);
        event.target.addLayer(unclusteredPointLayer);
      }}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/standard"
      interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
      onClick={onClick}
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
      <ScaleControl />

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
