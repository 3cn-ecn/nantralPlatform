import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  MapRef,
  Popup,
  ScaleControl,
  Source,
} from 'react-map-gl/mapbox';
import { useSearchParams } from 'react-router-dom';

import { Box } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { getMapGroupDetailApi } from '#modules/group/api/getMapGroupDetail.api';
import { getMapGroupListPreviewApi } from '#modules/group/api/getMapGroupListPreview.api';
import { MapGroupPreview } from '#modules/group/types/group.types';
import { CustomMapControls } from '#pages/Map/components/CustomMapControls';
import { PopupContent } from '#pages/Map/components/PopupContent';
import { SearchBar } from '#pages/Map/components/SearchBar';
import { useChangeThemeMode } from '#shared/context/CustomTheme.context';

import './styles/custom-mapbox-gl.css';
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from './styles/layers';

declare const MAPBOX_TOKEN: string;

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const groupType = useMemo(() => params.get('type'), [params]);
  const [showArchived, setShowArchived] = useState(false);
  const { currentThemeMode } = useChangeThemeMode();
  const [popupInfo, setPopupInfo] = useState<MapGroupPreview | null>(null);
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Get points from API
  const groupListQuery = useInfiniteQuery({
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
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

  // Fetch all the pages from the query
  useEffect(() => {
    if (groupListQuery.isSuccess && groupListQuery.hasNextPage) {
      groupListQuery.fetchNextPage();
    }
  }, [groupListQuery]);

  // Automatically change the theme of the map based on the theme mode
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setConfigProperty(
      'basemap',
      'lightPreset',
      currentThemeMode === 'dark' ? 'night' : 'day',
    );
  }, [currentThemeMode, mapRef]);

  // action performed when clicking a marker (i.e. showing a popup)
  const handleOpen = useCallback(
    (groupPoint: string) => {
      getMapGroupDetailApi(groupPoint).then((group) => {
        setPopupInfo(group);
        params.set('id', group.id.toString());
        setParams(params, { preventScrollReset: true });
        mapRef.current?.flyTo({
          // small bias to ensure that the popup is visible
          center: [group.longitude, group.latitude - 0.0005],
          zoom: 17,
          duration: 500,
        });
      });
    },
    [params, setParams],
  );

  // action performed when closing the popup
  const handleClose = () => {
    setPopupInfo(null);
    params.delete('id');
    setParams(params, { preventScrollReset: true });
  };

  // Automatically change selected group based on query param change
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

  // Action to perform when clicking an item from a layer
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
        setMapLoaded(true);

        // load the marker image
        event.target.loadImage('/static/img/marker.png', (error, result) => {
          if (error || !result) {
            console.error(error);
            return;
          }
          event.target.addImage('marker', result);
        });
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
      maxZoom={19}
      minZoom={1}
    >
      {mapLoaded && (
        <Source
          type={'geojson'}
          id={'groups'}
          data={
            groupListQuery.data && {
              type: 'FeatureCollection',
              features: groupListQuery.data.pages
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
            }
          }
          cluster
          clusterMaxZoom={16}
          clusterRadius={30}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      )}
      <Box position={'absolute'} p={2} width={'100%'} maxWidth={'sm'}>
        <SearchBar
          showArchived={showArchived}
          setShowArchived={setShowArchived}
        />
      </Box>
      <ScaleControl />
      <Box position={'absolute'} bottom={35} right={20}>
        <CustomMapControls />
      </Box>

      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          anchor="top"
          onClose={handleClose}
          closeButton={false}
        >
          <PopupContent group={popupInfo} onClose={handleClose} />
        </Popup>
      )}
    </Map>
  );
}
