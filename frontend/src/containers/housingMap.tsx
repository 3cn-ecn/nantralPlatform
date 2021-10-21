import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM, { render } from "react-dom";
import { easeCubic } from "react-d3-library";
import { Popup, Marker, FlyToInterpolator } from "react-map-gl";

import { Housing } from "./housingMap/interfaces";
import { MapForm } from "./housingMap/mapForm";
import { Pin } from "./housingMap/pin";
import { ColocInfo } from "./housingMap/colocInfo";
import { Map } from "./housingMap/map";

import { getRoommates } from "./housingMap/utils";

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
    getRoommates(props.api_housing_url, setColocs, setData);
  }, []);

  return (
    <>
      <div className="row">
        <div className="col">
          <h1>Carte des Colocs</h1>
        </div>
      </div>
      <MapForm
        colocs={colocs}
        data={data}
        setViewPort={setViewPort}
        setPopUpinfo={setPopUpinfo}
      />
      <Map
        viewport={viewport}
        mapRef={mapRef}
        apiKey={props.api_key}
        markers={markers}
        popupInfo={popupInfo}
        setViewPort={setViewPort}
        setPopUpinfo={setPopUpinfo}
      />
    </>
  );
}

document.body.style.margin = "0";
render(
  <Root api_key={MAPBOX_TOKEN} api_housing_url={api_housing_url} />,
  document.getElementById("root")
);
