﻿import React, { useState, useEffect } from "react";
import { render } from "react-dom";

import { Club } from "./clubsList/interfaces";
import { ClubIcon } from "./clubsList/clubIcon";

declare const myClubsURL: string;

function Root(props: {}): JSX.Element {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getClubs(): Promise<void> {
      await fetch(myClubsURL)
        .then((resp) => {
          resp.json().then((data) => {
            setClubs(data);
          });
        })
        .catch((err) => {
          setClubs([]);
        })
        .finally(() => setIsLoading(false));
    }
    getClubs();
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <div className="grille">
        {clubs.map((club: Club, key: number) => {
          return <ClubIcon club={club} key={key} />;
        })}
      </div>
    </>
  );
}

render(<Root />, document.getElementById("root"));
