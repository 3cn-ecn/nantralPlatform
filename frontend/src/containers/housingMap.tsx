import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM, { render } from "react-dom";
import MapGL, {
  Marker,
  GeolocateControl,
  Popup,
  FlyToInterpolator,
  NavigationControl,
} from "react-map-gl";
import { Form } from "react-bootstrap";
import axios from "axios";
import Cluster from "./housingMap/cluster";
import { easeCubic } from "react-d3-library";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

import { Housing } from "./housingMap/interfaces";
import { geolocateStyle, navControlStyle } from "./housingMap/styles";
import { ClusterMarker } from "./housingMap/clusterMarker";
import { Pin } from "./housingMap/pin";
import { ColocInfo } from "./housingMap/colocInfo";

// affichage principal
function Root(props): JSX.Element {
  const [data, setData] = useState([]);
  const [colocs, setColocs] = useState([]);
  const [viewport, setViewPort] = useState({
    latitude: 47.21784689284845,
    longitude: -1.5586376015280996,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopUpinfo] = useState(null);

  const mapRef = useRef(null);

  const markers = useMemo(() => {
    return data.map((housing: Housing) => (
      <Marker
        key={housing.longitude}
        longitude={housing.longitude}
        latitude={housing.latitude}
      >
        <Pin
          size={25}
          onClick={() => {
            setViewPort({
              zoom: 16,
              longitude: housing.longitude,
              latitude: housing.latitude,
              transitionDuration: 500,
              transitionInterpolator: new FlyToInterpolator(),
              transitionEasing: easeCubic,
            });
            setPopUpinfo(
              <Popup
                tipSize={10}
                anchor="bottom"
                longitude={housing.longitude}
                latitude={housing.latitude}
                closeOnClick={false}
                onClose={() => setPopUpinfo(null)}
                dynamicPosition={false}
                offsetTop={-10}
                offsetLeft={10}
              >
                <ColocInfo
                  housing={housing}
                  housingDetailsUrl={housing.roommates.url}
                />
              </Popup>
            );
          }}
        />
      </Marker>
    ));
  }, [data]);

  useEffect(() => {
    async function getRoommates(api_housing_url: string): Promise<void> {
      await axios
        .get(api_housing_url)
        .then((res) => {
          // For some reason, doubles Axios roommates which have more than one inhabitant,
          // so we have to do this mess to filter everything.
          // Hours wasted: 2
          var uniqueIds: number[] = [];
          let dataBuffer = res.data.filter((e, i) => {
            if (!uniqueIds.includes(e.id)) {
              uniqueIds.push(e.id);
              return true;
            }
            return false;
          });
          // Here, we avoid problems with roommates in the same building
          // (on different floors for example)
          // If two roommates are on the same coordinates, we shift them slightly so they don't overlap.
          let i = 0,
            j = 0;
          for (i = 0; i < dataBuffer.length; i++) {
            for (j = i + 1; j < dataBuffer.length; j++) {
              if (dataBuffer[i].longitude === dataBuffer[j].longitude) {
                dataBuffer[j].longitude += 0.00001;
              }
            }
          }
          setColocs(
            dataBuffer.map((housing) => {
              return { label: housing.roommates.name, housing: housing };
            })
          );
          setData(dataBuffer);
        })
        .catch((err) => {
          setData([]);
        });
    }
    getRoommates(props.api_housing_url);
  }, []);
  return (
    <>
      <div className="row">
        <div className="col">
          <h1>Carte des Colocs</h1>
        </div>
        <div className="col-12 col-md-6 col-lg-5 col-xl-4">
          <Form.Group>
            <Typeahead
              id="search-colocs"
              options={colocs}
              placeholder="Recherche"
              onChange={(coloc) => {
                if (typeof coloc[0] === "undefined") {
                  return;
                }
                let housings: Housing[] = data.filter(
                  (housing) => housing.id === coloc[0].housing.id
                );
                if (typeof housings[0] === "undefined") return;
                let housing: Housing = housings[0];
                setViewPort({
                  zoom: 16,
                  longitude: housing.longitude,
                  latitude: housing.latitude,
                  transitionDuration: 500,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: easeCubic,
                });
                setPopUpinfo(
                  <Popup
                    tipSize={10}
                    anchor="bottom"
                    longitude={housing.longitude}
                    latitude={housing.latitude}
                    closeOnClick={false}
                    onClose={() => setPopUpinfo(null)}
                    dynamicPosition={false}
                    offsetTop={-10}
                    offsetLeft={10}
                  >
                    <ColocInfo
                      housing={housing}
                      housingDetailsUrl={housing.roommates.url}
                    />
                  </Popup>
                );
              }}
            />
          </Form.Group>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mapbox">
          <MapGL
            {...viewport}
            width="100vw"
            height="80vh"
            ref={mapRef}
            mapStyle="mapbox://styles/mapbox/bright-v9"
            onViewportChange={setViewPort}
            mapboxApiAccessToken={props.api_key}
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
                        transitionEasing: easeCubic,
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
              auto
            />
            <NavigationControl showCompass={false} style={navControlStyle} />
          </MapGL>
        </div>
      </div>
    </>
  );
}

document.body.style.margin = "0";
render(
  <Root api_key={MAPBOX_TOKEN} api_housing_url={api_housing_url} />,
  document.getElementById("root")
);
