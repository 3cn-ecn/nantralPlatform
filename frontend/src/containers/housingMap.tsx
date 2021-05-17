﻿import * as React from "react";
import { Component, PureComponent, useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import MapGL, { Marker, GeolocateControl, Popup } from "react-map-gl";
import { Button } from "react-bootstrap";

const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10,
};
const positionOptions = { enableHighAccuracy: true };

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

function CityInfo(props): JSX.Element {
  const roommates = props.roommates;
	const housing_details_url = props.housing_details_url.replace("1", roommates.id)
	console.log(roommates);
	let roommatesList = roommates.roommates.join(", ");
  roommatesList = roommatesList.replace(/(,\s*)$/, "");
  return (
    <div>
      <div>
        <p>
          <strong>{roommates.name}</strong>
          &nbsp;-&nbsp;
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${roommates.address}`
              )
            }
          >
            Y aller
          </Button>
					&nbsp;
					<Button
						variant="secondary"
						size="sm"
						onClick={() =>
              window.open(
                housing_details_url
              )
            }
					>
						Détails
					</Button>
          <br />
          {roommates.address}
          <br />
          {roommatesList}
          <br />
          <br />
          <i>{roommates.details}</i>
        </p>
      </div>
    </div>
  );
}

function CityPin(props): JSX.Element {
  const { size = 20, onClick } = props;
  return (
    <svg height={size} viewBox="0 0 24 24" fill="#c20000" onClick={onClick}>
      <path d={ICON} />
    </svg>
  );
}

function Root(props): JSX.Element {
  const [markers, setMarkers] = useState([]);
  // Add an object here
  const [map, setMap] = useState({
    latitude: 47.21784689284845,
    longitude: -1.5586376015280996,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopUpinfo] = useState(null);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch(props.api_housing_url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Only rerender markers if props.data has changed
        setMarkers(
          data.map((roommates) => (
            <Marker
              key={roommates.address}
              longitude={roommates.longitude}
              latitude={roommates.latitude}
            >
              <CityPin
                size={20}
                onClick={() =>
                  setPopUpinfo(
                    <Popup
                      tipSize={10}
                      anchor="bottom"
                      longitude={roommates.longitude}
                      latitude={roommates.latitude}
                      closeOnClick={false}
                      onClose={() => setPopUpinfo(null)}
                      dynamicPosition={false}
                      offsetTop={-10}
                      offsetLeft={10}
                    >
                      <CityInfo roommates={roommates} housing_details_url={housing_details_url}/>
                    </Popup>
                  )
                }
              />
            </Marker>
          ))
        );
      });
  }, []);

  return (
    <MapGL
      {...map}
      width="100vw"
      height="80vh"
      mapStyle="mapbox://styles/mapbox/bright-v9"
      onViewportChange={setMap}
      mapboxApiAccessToken={props.api_key}
    >
      {markers}
      {popupInfo}
      <GeolocateControl
        style={geolocateStyle}
        positionOptions={positionOptions}
        trackUserLocation
        auto
      />
    </MapGL>
  );
}

document.body.style.margin = "0";
render(
  <Root api_key={MAPBOX_TOKEN} api_housing_url={api_housing_url} />,
  document.getElementById("root")
);
