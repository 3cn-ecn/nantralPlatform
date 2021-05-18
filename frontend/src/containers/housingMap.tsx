import * as React from "react";
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

function CityInfo(props): JSX.Element {
  const roommates = props.roommates;
  const housing_details_url = props.housing_details_url.replace(
    "1",
    roommates.id
  );
	let roommatesList:string = "";
	if(typeof roommates.roommates[0] != "undefined" && typeof roommates.roommates[0].members != "undefined"){
		roommatesList = roommates.roommates[0].members.map(e => e.student.first_name+" "+e.student.last_name).join(",");
		roommatesList = roommatesList.replace(/(,\s*)$/, "");
	}
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
            onClick={() => window.open(housing_details_url)}
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
  const { size = 25, onClick } = props;
  return (
    <svg viewBox="0 0 512 512" width={size} height={size} onClick={onClick}>
      <path
        fill="#0079f2"
        d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
		c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
		c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
      />
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
                size={25}
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
                      <CityInfo
                        roommates={roommates}
                        housing_details_url={housing_details_url}
                      />
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
