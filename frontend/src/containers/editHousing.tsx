import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM, { render } from "react-dom";
import { Button, Card, Modal, Form } from "react-bootstrap";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function EditHousing(props) {
  const [searchedStudents, updateSearchedStuents] = useState([]);
  const [roommates, updateRoommates] = useState([]);
  const [selectedRoommatesGroup, selectRoommatesGroup] = useState(null);
  const [showModalRommatesMember, updateShowModalRommatesMember] =
    useState(false);
  const [currentMembers, updateCurrentMembers] = useState([]);
  useEffect(() => {
    getRoommates();
  }, []);
  function getStudents(search: string) {
    fetch(`${props.student_url}?search=${search}`).then((resp) =>
      resp.json().then((students) => {
        updateSearchedStuents(searchedStudents);
      })
    );
  }
  const getRoommates = () => {
    fetch(props.roommates_api_url).then((resp) =>
      resp.json().then((roommatesGroups) => {
        console.log(roommatesGroups);
        updateRoommates(roommatesGroups);
      })
    );
  };
  return (
    <div>
      <h2>Les colocs qui sont passées par là:</h2>
      {roommates.length > 0 && (
        <div>
          {roommates.map((roommateGroup) => (
            <Card>
              <Card.Header>{roommateGroup["name"]}</Card.Header>
              <Card.Body>
                {roommateGroup["members"].map((member) => (
                  <p>
                    {member["student"]["first_name"]}{" "}
                    {member["student"]["last_name"]}{" "}
                    {member["student"]["last_name"]} alias {member["nickname"]}
                  </p>
                ))}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <AddRoommatesGroup
        cb={getRoommates}
        roommates_api_url={props.roommates_api_url}
      ></AddRoommatesGroup>
      <Modal show={showModalRommatesMember}>
        <Modal.Header>{selectedRoommatesGroup}</Modal.Header>
        <Modal.Body>
          {currentMembers.length > 0 &&
            currentMembers.map((member) => (
              <p>{member["student"]["first_name"]}</p>
            ))}
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Ajouter quelqu'un:</Form.Label>
              <Form.Control
                type="text"
                onInput={(event) => {
                  getStudents(event.target.value);
                }}
                placeholder="Jean"
              />
              {searchedStudents.length > 0 &&
                searchedStudents.map((suggestion) => (
                  <div>
                    <Button onClick={() => selectStudent(suggestion)}>
                      {suggestion.first_name} {suggestion.last_name}
                    </Button>
                    <br />
                  </div>
                ))}
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

function AddRoommatesGroup(props) {
  const [currentColocName, updateCurrentColocName] = useState(null);
  const [currentColocStart, updateCurrentColocStart] = useState(null);
  const [currentColocAddMe, updateCurrentColocAddMe] = useState(false);
  const [currentColocNickName, updateCurrentColocNickName] = useState(null);
  const [showModalRommatesGroupNew, updateshowModalRommatesGroupNew] =
    useState(false);
  function createRoommates() {
    axios
      .post(props.roommates_api_url, {
        name: currentColocName,
        begin_date: currentColocStart,
        add_me: currentColocAddMe,
        nickname: currentColocNickName,
      })
      .then(() => {
        props.cb();
        updateshowModalRommatesGroupNew(!showModalRommatesGroupNew);
      });
  }
  return (
    <div>
      <Button
        onClick={() =>
          updateshowModalRommatesGroupNew(!showModalRommatesGroupNew)
        }
      >
        Ajouter une nouvelle coloc ?
      </Button>
      <Modal show={showModalRommatesGroupNew}>
        <Modal.Footer>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Nom de votre coloc:</Form.Label>
              <Form.Control
                type="text"
                onInput={(event) => {
                  updateCurrentColocName(event.target.value);
                }}
                placeholder="Le Terminal"
              />
            </Form.Group>
            <Form.Group controlId="begin_date">
              <Form.Label>Date d'emenagement:</Form.Label>
              <Form.Control
                type="date"
                onInput={(event) => {
                  updateCurrentColocStart(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="add_me">
              <Form.Check
                type="checkbox"
                onInput={(event) => {
                  updateCurrentColocAddMe(event.target.value);
                }}
                label="M'ajouter dans la coloc"
              />
            </Form.Group>
            {currentColocAddMe && (
              <Form.Group controlId="nickname">
                <Form.Label>Un surnom?</Form.Label>
                <Form.Control
                  type="text"
                  onInput={(event) => {
                    updateCurrentColocNickName(event.target.value);
                  }}
                  placeholder="Gordon"
                />
                <Form.Text className="text-muted">
                  Si vous avez un surnom au sein de votre coloc que vous
                  souhaitez afficher.
                </Form.Text>
              </Form.Group>
            )}
          </Form>
          <Button
            onClick={() => {
              updateshowModalRommatesGroupNew(!showModalRommatesGroupNew);
              updateCurrentColocAddMe(false);
            }}
            variant="secondary"
          >
            Fermer
          </Button>
          <Button
            onClick={() => {
              createRoommates();
              updateshowModalRommatesGroupNew(!showModalRommatesGroupNew);
              updateCurrentColocAddMe(false);
            }}
            variant="success"
          >
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

render(
  <EditHousing
    student_url={student_url}
    roommates_api_url={roommates_api_url}
  />,
  document.getElementById("root")
);
