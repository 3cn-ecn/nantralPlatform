﻿import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM, { render } from "react-dom";
import { easeCubic } from "react-d3-library";
import { Popup, Marker, FlyToInterpolator } from "react-map-gl";
import { useCookies, CookiesProvider } from "react-cookie";

import { Housing, RootProps } from "./housingMap/interfaces";
import { ColocathlonSwitch } from "./housingMap/colocathlonSwitch";
import { MapForm } from "./housingMap/mapForm";
import { Pin } from "./housingMap/pin";
import { ColocInfo } from "./housingMap/colocInfo";
import { Map } from "./housingMap/map";
import { CurrentColocInfo } from "./housingMap/currentColocInfo";

import { getRoommates } from "./housingMap/utils";

function Root(props: RootProps): JSX.Element {
  const [data, setData] = useState<Housing[]>([]);
  const [colocs, setColocs] = useState([]);
  const [viewport, setViewPort] = useState({
    latitude: 47.21784689284845,
    longitude: -1.5586376015280996,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopUpinfo] = useState(null);

  const [cookies, setCookie, removeCookie] = useCookies(["colocathlon-cookie"]);
  let colocathlonCookieValue: boolean =
    cookies["colocathlon-cookie"] !== undefined
      ? cookies["colocathlon-cookie"] === "true"
      : props.PHASE_COLOCATHLON == 2;
  const [colocathlonParticipantsOnly, setColocathlonParticipantsOnly] =
    useState(colocathlonCookieValue);

  const handleColocathlonParticipants = (e: boolean) => {
    setCookie("colocathlon-cookie", e);
    setColocathlonParticipantsOnly(e);
  };

  const mapRef = useRef(null);

  const markers = useMemo(() => {
    let housings = data.filter(
      (e) => !colocathlonParticipantsOnly || e.roommates.colocathlon_agree
    );
    return housings.map((housing: Housing) => (
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
                  colocathlonOnly={colocathlonParticipantsOnly}
                />
              </Popup>
            );
          }}
        />
      </Marker>
    ));
  }, [data, colocathlonParticipantsOnly]);

  useEffect(() => {
    getRoommates(props.API_HOUSING_URL, setColocs, setData);
  }, []);

  return (
    <>
      <div className="row">
        <div className="col">
          <h1>Carte des Colocs</h1>
        </div>
        <MapForm
          colocs={colocs}
          data={data.filter(
            (e) => !colocathlonParticipantsOnly || e.roommates.colocathlon_agree
          )}
          setViewPort={setViewPort}
          setPopUpinfo={setPopUpinfo}
        />
      </div>
      {props.PHASE_COLOCATHLON > 1 ? (
        <div className="row">
          <ColocathlonSwitch
            status={colocathlonParticipantsOnly}
            handle={handleColocathlonParticipants}
          />
          {colocathlonParticipantsOnly ? (
            <CurrentColocInfo
              colocName={props.CURRENT_COLOC}
              colocUrl={props.CURRENT_COLOC_URL}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      <Map
        viewport={viewport}
        mapRef={mapRef}
        apiKey={props.API_KEY}
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
  <CookiesProvider>
    <Root
      API_KEY={MAPBOX_TOKEN}
      API_HOUSING_URL={API_HOUSING_URL}
      PHASE_COLOCATHLON={PHASE_COLOCATHLON}
      CURRENT_COLOC={CURRENT_COLOC}
      CURRENT_COLOC_URL={CURRENT_COLOC_URL}
    />
  </CookiesProvider>,
  document.getElementById("root")
);
