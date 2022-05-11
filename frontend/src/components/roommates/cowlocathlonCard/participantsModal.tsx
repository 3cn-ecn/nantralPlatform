import * as React from "react";
import { Modal } from "react-bootstrap";

import { ParticipantsModalProps } from "./interfaces";
import { ExportButton } from "../../event/eventsView/exportButton";
import { Student } from "../../event/eventsView/interfaces";

export function ParticipantsModal(props: ParticipantsModalProps): JSX.Element {
  return (
    <Modal show={props.showModal} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Liste des participant.e.s</Modal.Title>
        {
          <ExportButton
            participants={props.participants.map((e): Student => {
              return { name: e.name, get_absolute_url: e.absolute_url };
            })}
            title={""}
          />
        }
      </Modal.Header>
      <Modal.Body>
        <ul>
          {props.participants.map((e, i) => {
            return (
              <li key={i}>
                <a href={e.absolute_url}>{e.name}</a>
              </li>
            );
          })}
        </ul>
      </Modal.Body>
    </Modal>
  );
}
