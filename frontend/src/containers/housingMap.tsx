import * as React from "react";
import { Component, PureComponent, useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import MapGL, { Marker, GeolocateControl} from "react-map-gl";


const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10
};
const positionOptions = {enableHighAccuracy: true};


const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

function CityPin(props) {
  const { size = 20, onClick } = props;
  return (
    <svg height={size} viewBox="0 0 24 24" fill="#c20000" onClick={onClick}>
      <path d={ICON} />
    </svg>
  );
}

function Root(props): JSX.Element {
  const [markers, setMarkers] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 47.21784689284845,
    longitude: -1.5586376015280996,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    // Simple GET request with a JSON body using fetch
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/roommates/api/roommates/housing/", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Only rerender markers if props.data has changed
        setMarkers(
          data.map((housing) => (
            <Marker
              key={housing.adress}
              longitude={housing.longitude}
              latitude={housing.latitude}
            >
              <CityPin
                size={20}
                //onClick={() => this.setState({ popupInfo: "test" })}
              />
            </Marker>
          ))
        );
      });
  }, []);

  return (
    <MapGL
      {...viewport}
      width="70vw"
      height="60vh"
      mapStyle="mapbox://styles/mapbox/bright-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={props.api_key}
    >
      {markers}
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
render(<Root api_key={MAPBOX_TOKEN} />, document.getElementById("root"));
