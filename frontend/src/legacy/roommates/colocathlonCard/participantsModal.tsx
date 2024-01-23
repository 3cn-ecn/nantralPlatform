import { Modal } from 'react-bootstrap';

import { ParticipantsModalProps } from './interfaces';

export function ParticipantsModal(props: ParticipantsModalProps): JSX.Element {
  return (
    <Modal show={props.showModal} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Liste des participant.e.s</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {props.participants.map((e, i) => {
            return (
              <li key={i}>
                <a href={e.url}>{e.name}</a>
              </li>
            );
          })}
        </ul>
      </Modal.Body>
    </Modal>
  );
}
