import React, { useState, useEffect, useRef, useMemo } from 'react';
import { render } from 'react-dom';
import { Popup, Marker, FlyToInterpolator } from 'react-map-gl';
import { useCookies, CookiesProvider } from 'react-cookie';

import { Housing } from './housingMap/interfaces';
import { ColocathlonSwitch } from './housingMap/colocathlonSwitch';
import { MapForm } from './housingMap/mapForm';
import { Pin } from './housingMap/pin';
import { ColocInfo } from './housingMap/colocInfo';
import { Map } from './housingMap/map';
import { CurrentColocInfo } from './housingMap/currentColocInfo';
import { getRoommates } from './housingMap/utils';

declare const MAPBOX_TOKEN: string;
declare const API_HOUSING_URL: string;
declare const PHASE_COLOCATHLON: number;
declare const CURRENT_COLOC: string;
declare const CURRENT_COLOC_URL: string;

function Root(props: {}): JSX.Element {
  const [data, setData] = useState<Housing[]>([]);
  const [colocs, setColocs] = useState([]);
  const [viewport, setViewPort] = useState({
    latitude: 47.21784689284845,
    longitude: -1.5586376015280996,
    zoom: 12,
    transitionDuration: 500,
    transitionInterpolator: new FlyToInterpolator(),
    bearing: 0,
    pitch: 0,
  });
  const [popupInfo, setPopUpinfo] = useState(null);

  const [cookies, setCookie, removeCookie] = useCookies(['colocathlon-cookie']);
  let colocathlonCookieValue: boolean =
    cookies['colocathlon-cookie'] !== undefined
      ? cookies['colocathlon-cookie'] === 'true'
      : PHASE_COLOCATHLON == 2;
  const [colocathlonParticipantsOnly, setColocathlonParticipantsOnly] =
    useState(colocathlonCookieValue);

  const handleColocathlonParticipants = (e) => {
    setColocathlonParticipantsOnly(e.target.checked);
    setCookie('colocathlon-cookie', e.target.checked);
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
              bearing: 0,
              pitch: 0,
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
    getRoommates(API_HOUSING_URL, setColocs, setData);
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
      {PHASE_COLOCATHLON > 1 ? (
        <div className="row">
          <ColocathlonSwitch
            status={colocathlonParticipantsOnly}
            handle={handleColocathlonParticipants}
          />
          {colocathlonParticipantsOnly ? (
            <CurrentColocInfo
              colocName={CURRENT_COLOC}
              colocUrl={CURRENT_COLOC_URL}
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
        apiKey={MAPBOX_TOKEN}
        markers={markers}
        popupInfo={popupInfo}
        setViewPort={setViewPort}
        setPopUpinfo={setPopUpinfo}
      />
    </>
  );
}

document.body.style.margin = '0';
render(
  <CookiesProvider>
    <Root />
  </CookiesProvider>,
  document.getElementById('root')
);
