import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";

import { Club } from "./clubsList/interfaces";
import { ClubIcon } from "./clubsList/clubIcon";

function Root(props): JSX.Element {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getClubs(): Promise<void> {
      await fetch(props.myClubsURL)
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

render(<Root myClubsURL={myClubsURL} />, document.getElementById("root"));
