import React, { useState, useEffect } from "react";
import { render } from "react-dom";

import { cardStyle, cardH2Style } from "./cowlocathlonCard/styles";
import { Roommates } from "./housingMap/interfaces";
import { getRoommatesDetails } from "./cowlocathlonCard/utils";
import { ParticipateButton } from "./cowlocathlonCard/participateButton";

declare const API_URL: string;
declare const ROOMMATES_SLUG: string;
declare const EDIT_URL: string;
declare const IS_ADMIN: string;
declare const PHASE: number;
declare const USER_ID: number;

function Root(props: {}): JSX.Element {
  const isAdmin = IS_ADMIN === "True";
  const [roommates, setRoommates] = useState<Roommates>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (PHASE > 0) {
      getRoommatesDetails(API_URL, ROOMMATES_SLUG, setRoommates, setIsLoading);
    }
  }, []);

  if (isLoading) {
    return <></>;
  }
  if (isAdmin) {
    if (!roommates.colocathlon_agree) {
      return (
        <div className="card" style={cardStyle}>
          <h2 style={cardH2Style}>Cowlocathlon</h2>
          <p>Remplissez le form pour participer au colocathlon !</p>
          <a
            className="btn btn-primary"
            style={{ width: "max-content" }}
            href={EDIT_URL.replace("1", ROOMMATES_SLUG)}
          >
            Formulaire Cowlocathlon
          </a>
        </div>
      );
    }
    return (
      <div className="card" style={cardStyle}>
        <h2 style={cardH2Style}>Cowlocathlon</h2>

        <p>
          Horaires d'ouverture : {roommates.colocathlon_hours}
          <br />
          Activités proposées : {roommates.colocathlon_activities}
        </p>
        <p>
          <ParticipateButton
            API_URL={API_URL}
            ROOMMATES_SLUG={ROOMMATES_SLUG}
            isParticipating={
              roommates.colocathlon_participants.filter(
                (e) => e.user === USER_ID
              ).length > 0
            }
            participants={roommates.colocathlon_participants}
            quota={roommates.colocathlon_quota}
            isAdmin={isAdmin}
          />
          <a
            className="btn btn-secondary"
            style={{ width: "max-content", marginLeft: "0.2rem" }}
            href={EDIT_URL.replace("1", ROOMMATES_SLUG)}
          >
            Modifier
          </a>
        </p>
      </div>
    );
  } else if (PHASE == 2) {
    return (
      <div className="card" style={cardStyle}>
        <h2 style={cardH2Style}>Cowlocathlon</h2>

        <p>
          Horaires d'ouverture : {roommates.colocathlon_hours}
          <br />
          Activités proposées : {roommates.colocathlon_activities}
        </p>
        <ParticipateButton
          API_URL={API_URL}
          ROOMMATES_SLUG={ROOMMATES_SLUG}
          isParticipating={
            roommates.colocathlon_participants.filter((e) => e.user === USER_ID)
              .length > 0
          }
          participants={roommates.colocathlon_participants}
          quota={roommates.colocathlon_quota}
          isAdmin={isAdmin}
        />
      </div>
    );
  }
}

render(<Root />, document.getElementById("root"));
