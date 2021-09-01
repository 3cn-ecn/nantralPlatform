import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Spinner } from "react-bootstrap";
import { spinnerDivStyle, spinnerStyle, clubStyle } from "./clubsList/styles";
import { Club } from "./clubsList/interfaces";

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
    return (
      <>
        <h2>Mes Clubs et Assos</h2>
        <div className="grille" style={spinnerDivStyle}>
          <Spinner animation="border" role="status" style={spinnerStyle} />
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Mes Clubs et Assos</h2>
      <div className="grille">
        {clubs.map((club: Club, key: number) => {
          return (
            <div
              className="grille-icon text-center"
              style={clubStyle}
              key={key}
            >
              <a href={club.get_absolute_url} className="stretched-link">
                <div className="ratio ratio-1x1">
                  <img src={club.logo_url} style={{ opacity: club.opacity }} />
                </div>
              </a>
              <h6>{club.name}</h6>
            </div>
          );
        })}
      </div>
    </>
  );
}

render(<Root myClubsURL={myClubsURL} />, document.getElementById("root"));
