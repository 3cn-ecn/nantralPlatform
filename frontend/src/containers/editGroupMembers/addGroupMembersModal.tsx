import * as React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import { Modal, Button, Form } from "react-bootstrap";

import { MemberAdd } from "../groupMembers/interfaces";
import { addMember } from "./utils";

export function AddGroupMembersModal(props): JSX.Element {
  const { showModal, setShowModal, membersURL, setIsLoading, setMembers } =
    props;

  if (!showModal) {
    return <></>;
  }

  const [formData, setFormData] = useState<MemberAdd>({});
  const [isAddLoading, setIsAddLoading] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    addMember(
      membersURL,
      formData,
      handleClose,
      setIsAddLoading,
      setIsLoading,
      setMembers
    );
  };

  return (
    <Modal show={showModal} onHide={handleClose} onSubmit={handleSubmit}>
      <Modal.Header closeButton>
        <Modal.Title>Ajout d'un.e membre</Modal.Title>
      </Modal.Header>

      <Modal.Body style={isAddLoading ? { opacity: "0.4" } : null}>
        <Form>
          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Etudiant.e</Form.Label>
            <Form.Control
              type="integer"
              onChange={({ target: { value } }) => {
                let newFormData = formData;
                newFormData["id"] = value;
                setFormData(newFormData);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Rôle</Form.Label>
            <Form.Control
              type="text"
              onChange={({ target: { value } }) => {
                let newFormData = formData;
                newFormData["role"] = value;
                setFormData(newFormData);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDateBegin">
            <Form.Label>Date de début</Form.Label>
            <Form.Control
              type="date"
              onChange={({ target: { value } }) => {
                let newFormData = formData;
                newFormData["begin_date"] = value;
                setFormData(newFormData);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDateEnd">
            <Form.Label>Date de fin</Form.Label>
            <Form.Control
              type="date"
              onChange={({ target: { value } }) => {
                let newFormData = formData;
                newFormData["end_date"] = value;
                setFormData(newFormData);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAdmin">
            <Form.Check
              type="checkbox"
              label="Admin"
              onChange={({ target: { value } }) => {
                let newFormData = formData;
                newFormData["admin"] = value;
                setFormData(newFormData);
              }}
            />
          </Form.Group>
          <div style={{ float: "right" }}>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
