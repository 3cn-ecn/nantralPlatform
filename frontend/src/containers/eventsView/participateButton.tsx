import * as React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { EventInfos, Urls, Student } from "./interfaces";
import { spinnerDivStyle, spinnerStyle } from "./styles";

export function ParticipateButton(props): JSX.Element {
  const urls: Urls = props.urls;
  const eventInfos: EventInfos = props.eventInfos;

  const [isParticipating, setIsParticipating] = useState(
    eventInfos.is_participating
  );
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    props.number_of_participants
  );
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
  const [participants, setParticipants] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const faIconStyle: CSSProperties = {
    marginRight: 7,
  };
  return (
    <div className="btn-group" role="group">
      <Button variant="secondary" size="sm">
        <i className="fas fa-users" style={faIconStyle}></i>
        {numberOfParticipants}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setLoading(true);
          axios
            .get(
              isParticipating
                ? urls.remove.replace("1", eventInfos.slug)
                : urls.add.replace("1", eventInfos.slug)
            )
            .then(() => {
              let offset = isParticipating ? -1 : 1;
              setIsParticipating(!isParticipating);
              setNumberOfParticipants(numberOfParticipants + offset);
            })
            .finally(() => setLoading(false));
        }}
      >
        {(() => {
          if (isParticipating) {
            return (
              <>
                <i className="fas fa-times" style={faIconStyle}></i>
                {isLoading ? "Chargement..." : "Je ne participe plus"}
              </>
            );
          }
          return (
            <>
              <i className="fas fa-check" style={faIconStyle}></i>
              {isLoading ? "Chargement..." : "Je participe"}
            </>
          );
        })()}
      </Button>
      {(() => {
        if (eventInfos.is_member) {
          return (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsParticipantsLoading(true);
                handleOpen();
                axios
                  .get(urls.participants.replace("1", eventInfos.slug))
                  .then((res) => {
                    setParticipants(res.data);
                  })
                  .catch((err) => {
                    setParticipants([]);
                  })
                  .finally(() => setIsParticipantsLoading(false));
              }}
            >
              <i className="fas fa-list" style={faIconStyle}></i>
              {"Liste des participant.e.s"}
            </Button>
          );
        }
      })()}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Liste des participant.e.s</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isParticipantsLoading ? (
            <div style={spinnerDivStyle}>
              <CircularProgress style={spinnerStyle} />
            </div>
          ) : (
            <ul>
              {participants.map((e: Student) => {
                return (
                  <>
                    <li>
                      <a href={e.get_absolute_url}>{e.name}</a>
                    </li>
                  </>
                );
              })}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
