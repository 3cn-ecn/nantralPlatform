import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM, { render } from "react-dom";
import axios from "axios";
import { easeCubic } from "react-d3-library";
import { Popup, Marker, FlyToInterpolator } from "react-map-gl";

import { Housing } from "./housingMap/interfaces";
import { MapForm } from "./housingMap/mapForm";
import { Pin } from "./housingMap/pin";
import { ColocInfo } from "./housingMap/colocInfo";
import { Map } from "./housingMap/map";

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
