import * as React from "react";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import axios, { AxiosResponse } from "axios";

import { ParticipantsModal } from "./participantsModal";
import { ParticipateButtonProps } from "./interfaces";
import { spinnerStyle } from "./styles";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

export function ParticipateButton(props: ParticipateButtonProps): JSX.Element {
  const [isParticipating, setIsParticipating] = useState(props.isParticipating);
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    props.participants.length
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  return (
    <>
      <Button
        variant={props.isAdmin ? "success" : "primary"}
        // Do not listen to the linter here, "" works just fine...
        size=""
        style={{ width: "max-content" }}
        onClick={() => {
          if (props.isAdmin) {
            handleOpen();
            return;
          }
          setIsLoading(true);
          if (numberOfParticipants >= props.quota && !isParticipating) {
            setIsLoading(false);
            return;
          }
          axios
            .post(props.API_URL, {
              addOrDelete: isParticipating ? 1 : 0,
              slug: props.ROOMMATES_SLUG,
            })
            .then((res: AxiosResponse) => {
              setIsParticipating(!isParticipating);
              setNumberOfParticipants(
                numberOfParticipants + (isParticipating ? -1 : 1)
              );
            })
            .finally(() => setIsLoading(false));
        }}
      >
        {(() => {
          if (props.isAdmin) {
            return "Voir les participant.e.s";
          }
          return isParticipating
            ? "Libérer ma place"
            : numberOfParticipants < props.quota
            ? "Réserver ma place !"
            : "Complet";
        })()}
        {"    "}

        <span className="badge bg-light text-primary">
          {isLoading ? (
            <Spinner animation="border" role="status" style={spinnerStyle} />
          ) : (
            `${numberOfParticipants}/${props.quota}`
          )}
        </span>
      </Button>
      <ParticipantsModal
        showModal={showModal}
        handleClose={handleClose}
        participants={props.participants}
      />
    </>
  );
}
