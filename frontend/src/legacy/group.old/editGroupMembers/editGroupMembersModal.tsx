﻿import * as React from 'react';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import { EditGroupMembersModalProps } from './interfaces';
import { updateMember, deleteMember } from './utils';

export function EditGroupMembersModal(
  props: EditGroupMembersModalProps
): JSX.Element {
  const {
    showModal,
    setShowModal,
    selectedMember,
    membersURL,
    setIsLoading,
    setMembers,
  } = props;

  const [role, setRole] = useState(selectedMember.function);
  const [startDate, setstartDate] = useState(
    selectedMember.date_begin
      ? selectedMember.date_begin.replaceAll('/', '-')
      : null
  );
  const [endDate, setEndDate] = useState(
    selectedMember.date_end
      ? selectedMember.date_end.replaceAll('/', '-')
      : null
  );
  const [admin, setAdmin] = useState(selectedMember.admin);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  if (!showModal) {
    return null;
  }
  const handleClose = () => setShowModal(false);

  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    updateMember(
      membersURL,
      selectedMember,
      role,
      startDate,
      endDate,
      admin,
      handleClose,
      setIsUpdateLoading,
      setIsLoading,
      setMembers
    );
  };

  return (
    <Modal show={showModal} onHide={handleClose} onSubmit={handleSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedMember.student.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={isUpdateLoading ? { opacity: '0.4' } : null}>
        <Form>
          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Rôle</Form.Label>
            <Form.Control
              type="text"
              defaultValue={selectedMember.function}
              onChange={({ target: { value } }) => setRole(value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDateBegin">
            <Form.Label>Date de début</Form.Label>
            <Form.Control
              type="date"
              defaultValue={startDate}
              onChange={({ target: { value } }) => setstartDate(value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDateEnd">
            <Form.Label>Date de fin</Form.Label>
            <Form.Control
              type="date"
              defaultValue={endDate}
              onChange={({ target: { value } }) => setEndDate(value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAdmin">
            <Form.Check
              type="checkbox"
              label="Admin"
              defaultChecked={admin}
              onChange={() => {
                setAdmin(!admin);
              }}
            />
          </Form.Group>
          <div style={{ float: 'right' }}>
            <Button variant="primary" type="submit">
              Mettre à jour
            </Button>

            <Button
              style={{ marginLeft: '0.5rem' }}
              variant="danger"
              onClick={() =>
                deleteMember(
                  membersURL,
                  selectedMember,
                  handleClose,
                  setIsUpdateLoading,
                  setIsLoading,
                  setMembers
                )
              }
            >
              Supprimer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}