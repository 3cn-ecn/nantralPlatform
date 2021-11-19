import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Spinner, Button } from "react-bootstrap";
import axios from "axios";

import { spinnerDivStyle, spinnerStyle } from "./clubsList/styles";
import { Member } from "./groupMembers/interfaces";
import { EditGroupMembersModal } from "./editGroupMembers/editGroupMembersModal";
import { AddGroupMembersModal } from "./editGroupMembers/addGroupMembersModal";
import { getMembers } from "./groupMembers/utils";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function Root(props): JSX.Element {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member>(undefined);

  useEffect(() => {
    getMembers(props.membersURL, setMembers, setIsLoading);
  }, []);

  if (isLoading) {
    return (
      <div className="grille" style={spinnerDivStyle}>
        <Spinner animation="border" role="status" style={spinnerStyle} />
      </div>
    );
  }

  return (
    <>
      <EditGroupMembersModal
        setShowModal={setShowEditModal}
        showModal={showEditModal}
        selectedMember={selectedMember}
        membersURL={props.membersURL}
        setMembers={setMembers}
        setIsLoading={setIsLoading}
      />
      <AddGroupMembersModal
        setShowModal={setShowAddModal}
        showModal={showAddModal}
        membersURL={props.membersURL}
        studentsURL={props.studentsURL}
        setMembers={setMembers}
        setIsLoading={setIsLoading}
      />
      <div className="table-responsive">
        {members.length > 0 ? (
          <table className="table table-hover table-sm">
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col" className="d-none d-sm-table-cell">
                  Membre depuis
                </th>
                <th scope="col" className="d-none d-sm-table-cell">
                  Rôle
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((e, i) => (
                <tr
                  style={{ transform: "rotate(0)" }}
                  key={i}
                  onClick={() => {
                    setSelectedMember(e);
                    setShowEditModal(true);
                  }}
                >
                  <td className="d-none d-sm-table-cell">{e.student.name}</td>
                  <td className="d-none d-sm-table-cell">{e.date_begin}</td>
                  <td className="d-none d-sm-table-cell">{e.function}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          "Aucun membre pour l'instant... 😥"
        )}
      </div>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Ajouter un.e membre
      </Button>
    </>
  );
}

render(
  <Root membersURL={membersURL} studentsURL={studentsURL} />,
  document.getElementById("root2")
);
