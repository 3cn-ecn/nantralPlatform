import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Spinner } from "react-bootstrap";
import { spinnerDivStyle, spinnerStyle } from "./clubsList/styles";
import { Member } from "./groupMembers/interfaces";
import { StudentCard } from "./groupMembers/studentCard";

function Root(props): JSX.Element {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    async function getMembers(): Promise<void> {
      await fetch(props.membersURL)
        .then((resp) => {
          if (resp.status === 403) {
            setMembers([]);
            setIsAuthorized(false);
          }
          resp.json().then((data) => {
            setMembers(data);
          });
        })
        .catch((err) => {
          setMembers([]);
        })
        .finally(() => setIsLoading(false));
    }
    getMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="grille" style={spinnerDivStyle}>
        <Spinner animation="border" role="status" style={spinnerStyle} />
      </div>
    );
  }

  if (!isAuthorized) {
    return <p>Veuillez vous connecter pour voir les membres.</p>;
  }

  return (
    <div className="row g-3">
      {members.length > 0
        ? members.map((member: Member, key: number) => {
            return <StudentCard member={member} key={key} />;
          })
        : "Aucun membre pour l'instant... 😥"}
    </div>
  );
}

render(<Root membersURL={membersURL} />, document.getElementById("root2"));
