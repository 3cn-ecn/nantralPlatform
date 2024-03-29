﻿import MapGL, {
  FlyToInterpolator,
  GeolocateControl,
  NavigationControl,
} from 'react-map-gl';

import Cluster from './cluster';
import { ClusterMarker } from './clusterMarker';
import { geolocateStyle, navControlStyle } from './styles';

export function Map(props): JSX.Element {
  const {
    viewport,
    mapRef,
    apiKey,
    markers,
    popupInfo,
    setViewPort,
    setPopUpinfo,
  } = props;
  return (
    <div className="row">
      <div className="col-12 mapbox">
        <MapGL
          {...viewport}
          width="100vw"
          height="80vh"
          ref={mapRef}
          mapStyle="mapbox://styles/mapbox/bright-v9"
          onViewportChange={setViewPort}
          mapboxApiAccessToken={apiKey}
          onClick={() => setPopUpinfo(null)}
        >
          {mapRef.current && markers && (
            <Cluster
              map={mapRef.current.getMap()}
              radius={20}
              extent={512}
              nodeSize={40}
              element={(clusterProps) => (
                <ClusterMarker
                  {...clusterProps}
                  onClick={() => {
                    const [longitude, latitude] =
                      clusterProps.cluster.geometry.coordinates;
                    setViewPort({
                      zoom: 16,
                      longitude: longitude,
                      latitude: latitude,
                      transitionDuration: 500,
                      transitionInterpolator: new FlyToInterpolator(),
                    });
                  }}
                />
              )}
            >
              {markers}
            </Cluster>
          )}

          {popupInfo}
          <GeolocateControl
            style={geolocateStyle}
            positionOptions={{
              enableHighAccuracy: true,
            }}
            trackUserLocation
            // auto
          />
          <NavigationControl showCompass={false} style={navControlStyle} />
        </MapGL>
      </div>
    </div>
  );
}
