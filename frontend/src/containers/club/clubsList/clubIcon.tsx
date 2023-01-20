import * as React from "react";
import { Club } from "./interfaces";
import { clubStyle } from "./styles";

export function ClubIcon(props): JSX.Element {
  const club: Club = props.club;
  return (
    <div className="grille-icon text-center" style={clubStyle}>
      <a href={club.get_absolute_url} className="stretched-link">
        <div className="ratio ratio-1x1">
          <img src={club.logo_url}/>
        </div>
      </a>
      <h6>{club.name}</h6>
    </div>
  );
}
