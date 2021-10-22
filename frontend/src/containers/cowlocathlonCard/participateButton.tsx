import * as React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ParticipateButtonProps } from "./interfaces";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export function ParticipateButton(props: ParticipateButtonProps): JSX.Element {
  const [isParticipating, setIsParticipating] = useState(props.isParticipating);
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    props.nbParticipants
  );
  return (
    <Button
      variant="primary"
      size="sm"
      style={{ width: "max-content" }}
      onClick={() => {
        axios
          .post(props.API_URL, {
            addOrDelete: isParticipating ? 1 : 0,
            slug: props.ROOMMATES_SLUG,
          })
          .then((res) => {
            setIsParticipating(!isParticipating);
            setNumberOfParticipants(
              numberOfParticipants + (isParticipating ? -1 : 1)
            );
          });
      }}
    >
      {props.isParticipating ? "Libérer ma place   " : "Réserver ma place !   "}
      <span className="badge bg-light text-primary">
        {numberOfParticipants}/{props.quota}
      </span>
    </Button>
  );
}
