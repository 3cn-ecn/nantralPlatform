import * as React from "react";
import { useState, useEffect, useRef } from "react";
import ReactDOM, { render } from "react-dom";
import MapGL, {
  Marker,
  GeolocateControl,
  Popup,
  FlyToInterpolator,
  NavigationControl,
} from "react-map-gl";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import Cluster from "./cluster.tsx";
import rd3 from "react-d3-library";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";

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

function toTitle(str: string): string {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return undefined;
}

function ColocInfo(props: CityInfoProps): JSX.Element {
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
      .map(
        (e) =>
          toTitle(e.student.first_name) + " " + toTitle(e.student.last_name)
      )
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

interface PinProps {
  size: number;
  onClick: any;
}

function Pin(props: PinProps): JSX.Element {
  const size: number = 20;
  return (
    <svg
      style={{ transform: `translate(${-size / 2}px,${-size}px)` }}
      viewBox="0 0 512 512"
      width={props.size}
      height={props.size}
      onClick={props.onClick}
    >
      <path
        fill="#cc0000"
        d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
		c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
		c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"
      />
    </svg>
  );
}

const styleClusterMarker: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  width: "25px",
  height: "25px",
  lineHeight: "25px",
  borderRadius: "50%",
  fontSize: "1rem",
  color: "#fff",
  textAlign: "center",
  background: "#0079f2",
};

const styleClusterMarkerContainer: React.CSSProperties = {
  position: "relative",
  width: "35px",
  height: "35px",
  lineHeight: "35px",
  borderRadius: "50%",
  fontSize: "1rem",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  background: "#cce6ff",
};

const styleClusterOnClickContainer: React.CSSProperties = {
	zIndex: 9
}

function ClusterMarker(props): JSX.Element {
  const { cluster, onClick } = props;
  return (
		<div style={styleClusterOnClickContainer} onClick={onClick}>
			<div style={styleClusterMarkerContainer}>
				<div style={styleClusterMarker}>{cluster.properties.point_count}</div>
			</div>
		</div>
  );
}

function Root(props): JSX.Element {
  const navControlStyle: React.CSSProperties = {
    right: 10,
    top: 10,
  };
  const styleSearchBar: React.CSSProperties = {
    marginTop: "2rem",
    maxWidth: "300px",
  };
  const [data, setData] = useState([]);
  const [colocs, setColocs] = useState([]);
  const [selectColoc, setSelectColoc] = useState([]);
  // Add an object here
  const [viewport, setViewPort] = useState({
    latitude: 47.21784689284845,
    longitude: -1.5586376015280996,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopUpinfo] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    async function getRoommates(): Promise<void> {
      await axios
        .get(props.api_housing_url)
        .then((res) => {
          // For some reason, Axios roommates which have more than one inhabitant,
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
          setColocs(
            dataBuffer.map((roommate) => {
              return { label: roommate.name, roommate: roommate };
            })
          );
          setData(dataBuffer);
        })
        .catch((err) => {
          setData([]);
        });
    }
    getRoommates();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Form.Group style={styleSearchBar}>
            <Typeahead
              id="search-colocs"
              onChange={(coloc) => {
                if (typeof coloc[0] === "undefined") {
                  return;
                }
                setSelectColoc(coloc);
                let roommate = data.filter(
                  (roommateElt) => roommateElt.id === coloc[0].roommate.id
                );
                if (typeof roommate[0] === "undefined") return;
                roommate = roommate[0];
                setViewPort({
                  zoom: 16,
                  longitude: roommate.longitude,
                  latitude: roommate.latitude,
                  transitionDuration: 500,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: rd3.easeCubic,
                });
                setPopUpinfo(
                  <Popup
                    tipSize={10}
                    anchor="bottom"
                    longitude={roommate.longitude}
                    latitude={roommate.latitude}
                    closeOnClick={false}
                    onClose={() => setPopUpinfo(null)}
                    dynamicPosition={false}
                    offsetTop={-10}
                    offsetLeft={10}
                  >
                    <ColocInfo
                      housing={roommate}
                      housingDetailsUrl={housing_details_url}
                    />
                  </Popup>
                );
              }}
              options={colocs}
              placeholder="Recherche"
              selected={selectColoc}
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
            {mapRef.current && (
              <Cluster
                map={mapRef.current.getMap()}
                radius={20}
                extent={512}
                nodeSize={40}
                element={(clusterProps) => (
                  <ClusterMarker
                    {...clusterProps}
										onClick={() => {
											const [longitude, latitude] = clusterProps.cluster.geometry.coordinates;
											setViewPort({
												zoom: 16,
												longitude: longitude,
												latitude: latitude,
												transitionDuration: 500,
												transitionInterpolator: new FlyToInterpolator(),
												transitionEasing: rd3.easeCubic,
											});
										}}
                  />
                )}
              >
                {data.map((roommate) => (
                  <Marker
                    key={roommate.address}
                    longitude={roommate.longitude}
                    latitude={roommate.latitude}
                  >
                    <Pin
                      size={25}
                      onClick={() => {
                        setViewPort({
                          zoom: 16,
                          longitude: roommate.longitude,
                          latitude: roommate.latitude,
                          transitionDuration: 500,
                          transitionInterpolator: new FlyToInterpolator(),
                          transitionEasing: rd3.easeCubic,
                        });
                        setPopUpinfo(
                          <Popup
                            tipSize={10}
                            anchor="bottom"
                            longitude={roommate.longitude}
                            latitude={roommate.latitude}
                            closeOnClick={false}
                            onClose={() => setPopUpinfo(null)}
                            dynamicPosition={false}
                            offsetTop={-10}
                            offsetLeft={10}
                          >
                            <ColocInfo
                              housing={roommate}
                              housingDetailsUrl={housing_details_url}
                            />
                          </Popup>
                        );
                      }}
                    />
                  </Marker>
                ))}
              </Cluster>
            )}

            {popupInfo}
            <GeolocateControl
              style={geolocateStyle}
              positionOptions={positionOptions}
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
