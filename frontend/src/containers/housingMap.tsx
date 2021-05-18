import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import MapGL, { Marker, GeolocateControl, Popup } from "react-map-gl";
import { Button } from "react-bootstrap";
import axios from "axios";

export interface Housing {
  id: number;
  edit_url: string;
  url: string;
  roommates: Roommate[];
  name: string;
  address: string;
  details: string;
  latitude: number;
  longitude: number;
}

export interface Roommate {
  id: number;
  members: Member[];
  admins: Member[];
  edit_members_api_url: string;
  edit_api_url: string;
  name: string;
  description: string;
  logo: any;
  slug: string;
  parent: any;
  begin_date: string;
  end_date: string;
  housing: number;
}

export interface Member {
  id: number;
  student: Student;
  edit_api_url: string;
  nickname: string;
  roommates: number;
}

export interface Student {
  id: number;
  promo: any;
  picture: any;
  first_name: string;
  last_name: string;
  faculty: string;
  path: any;
  user: number;
}

interface CityInfoProps {
  housing: Housing;
  housingDetailsUrl: string;
}

const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10,
};

const positionOptions = {
  enableHighAccuracy: true,
};

function CityInfo(props: CityInfoProps): JSX.Element {
  const housing: Housing = props.housing;
  const housing_details_url = props.housingDetailsUrl.replace(
    "1",
    housing.id.toString()
  );
  let roommatesList: string = "";
  if (
    typeof housing.roommates[0] != "undefined" &&
    typeof housing.roommates[0].members != "undefined"
  ) {
    roommatesList = housing.roommates[0].members
      .map((e) => e.student.first_name + " " + e.student.last_name)
      .join(",");
    roommatesList = roommatesList.replace(/(,\s*)$/, "");
  }
  return (
    <div>
      <div>
        <p>
          <strong>{housing.name}</strong>
          &nbsp;-&nbsp;
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${housing.address}`
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
          {housing.address}
          <br />
          {roommatesList}
          <br />
          <br />
          <i>{housing.details}</i>
        </p>
      </div>
    </div>
  );
}

interface CityPinProps {
  size: number;
  onClick: any;
}

function CityPin(props: CityPinProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 512 512"
      width={props.size}
      height={props.size}
      onClick={props.onClick}
    >
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
    async function getRoommates(): Promise<void> {
      await axios
        .get(props.api_housing_url)
        .then((res) => {
          setMarkers(
            res.data.map((roommates) => (
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
                          housing={roommates}
                          housingDetailsUrl={housing_details_url}
                        />
                      </Popup>
                    )
                  }
                />
              </Marker>
            ))
          );
        })
        .catch((err) => {
          setMarkers([]);
        });
    }
    getRoommates();
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
