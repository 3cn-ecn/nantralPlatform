import * as React from "react";
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import axios, { AxiosError, AxiosResponse } from "axios";

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
  const [error, setError] = useState<boolean>(false);
  const [currentColoc, setCurrentColoc] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  return (
    <>
      <Button
        variant={props.isAdmin ? "success" : error ? "danger" : "primary"}
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
            .catch((err: Error | AxiosError) => {
              if (axios.isAxiosError(err) && err.response.data !== undefined) {
                setError(true);
                setCurrentColoc([
                  err.response.data.name,
                  err.response.data.url,
                ]);
              }
            })
            .finally(() => setIsLoading(false));
        }}
      >
        {error ? (
          // I am sorry for this
          <>
            {"Vous êtes déjà inscrit.e à "}
            <a href={currentColoc[1]}>{currentColoc[0]}</a>
          </>
        ) : isParticipating ? (
          "Libérer ma place"
        ) : numberOfParticipants < props.quota ? (
          "Réserver ma place !"
        ) : (
          "Complet"
        )}
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
