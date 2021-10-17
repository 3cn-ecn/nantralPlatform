import * as React from "react";
import { Button } from "react-bootstrap";

import { Housing, CityInfoProps } from "./interfaces";

export function ColocInfo(props: CityInfoProps): JSX.Element {
  const housing: Housing = props.housing;
  let roommatesList: string = "";
  if (
    typeof housing.roommates != "undefined" &&
    typeof housing.roommates.members != "undefined"
  ) {
    roommatesList = housing.roommates.members
      .map((e) => e.name)
      .join(", ")
      .replace(/(,\s*)$/, "");
  }
  return (
    <div>
      <div>
        <p>
          <strong>{housing.roommates.name}</strong>
          &nbsp;-&nbsp;
          <Button
            variant="primary"
            size="sm"
            href={`https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=${housing.address}`}
            target="_blank"
          >
            Y aller
          </Button>
          &nbsp;
          <Button variant="secondary" size="sm" href={housing.roommates.url}>
            Détails
          </Button>
          <br />
          <small>
            {housing.address}
            <br />
            <i>{housing.details}</i>
          </small>
        </p>
        <p>{roommatesList}</p>
      </div>
    </div>
  );
}
