import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM, { render } from "react-dom";
import { Button, Card, Modal, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function EditHousing(props) {
  const [roommates, updateRoommates] = useState([]);
  const [selectedGroup, updateSelectedGroup] = useState(null);
  useEffect(() => {
    getRoommates();
  }, []);
  const getRoommates = () => {
    fetch(props.roommates_api_url).then((resp) =>
      resp.json().then((roommatesGroups) => {
        updateRoommates(roommatesGroups);
      })
    );
  };
  const selectGroup = (group) => {
    console.log(group);
    updateSelectedGroup(group);
  };
  const deleteGroup = (group) => {
    axios.delete(group["edit_api_url"]).then((resp) => {
      getRoommates();
    });
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
                <Row>
                  <Col md="10" xs="12">
                    {roommateGroup["members"].map((member) => (
                      <p>
                        {member["student"]["name"]}
                      </p>
                    ))}
                  </Col>
                  <Col md="2" xs="12">
                    <Row>
                      <Col>
                        <Button onClick={() => selectGroup(roommateGroup)}>
                          <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          onClick={() => deleteGroup(roommateGroup)}
                          variant="danger"
                        >
                          <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <EditRoommatesGroup
        cb={getRoommates}
        selectedGroup={selectedGroup}
        student_url={props.student_url}
        close={() => {
          selectGroup(null);
        }}
      ></EditRoommatesGroup>
      <AddRoommatesGroup
        cb={getRoommates}
        roommates_api_url={props.roommates_api_url}
      ></AddRoommatesGroup>
    </div>
  );
}

function EditRoommatesGroup(props) {
  const [selectedRoommatesGroup, selectRoommatesGroup] = useState(null);
  const [searchedStudents, updateSearchedStuents] = useState([]);
  const [changedMemberNickname, updateChangedMemberNickname] = useState({});
  function getStudents(search: string) {
    if (search.length > 1) {
      fetch(`${props.student_url}?search=${search}`).then((resp) =>
        resp.json().then((students) => {
          console.log(students);
          updateSearchedStuents(students);
        })
      );
    } else {
      updateSearchedStuents([]);
    }
  }
  function selectStudent(student) {
    axios
      .post(selectedRoommatesGroup["edit_members_api_url"], {
        student: student["id"],
      })
      .then((resp) => {
        props.cb();
        selectRoommatesGroup(props.selectedGroup);
        updateSearchedStuents([]);
      });
  }
  function deleteMembership(url) {
    axios.delete(url).then((resp) => {
      props.cb();
      selectRoommatesGroup(props.selectedGroup);
    });
  }

  function editMembership(member) {
    member["nickname"] = changedMemberNickname["nickname"];
    axios.put(member["edit_api_url"], member).then(() => {
      updateChangedMemberNickname({});
    });
  }
  useEffect(() => {
    console.log(props.selectedGroup);
    selectRoommatesGroup(props.selectedGroup);
  });

  return (
    <div>
      {selectedRoommatesGroup != null && (
        <Modal show={selectedRoommatesGroup != null}>
          <Modal.Header>{selectedRoommatesGroup["name"]}</Modal.Header>
          <Modal.Body>
            {selectedRoommatesGroup.members.length > 0 && (
              <div>
                <Card.Header>
                  <Row>
                    <Col>Nom</Col>
                    <Col>Surnom</Col>
                    <Col></Col>
                  </Row>
                </Card.Header>
                {selectedRoommatesGroup.members.map((member, index) => (
                  <Card>
                    <Row className="text-center">
                      <Col>{member["student"]["name"]}</Col>
                      <Col>
                        <Form>
                          <Form.Group controlId="name">
                            <Form.Control
                              type="text"
                              placeholder="Gordon"
                              defaultValue={member["nickname"]}
                              autoComplete="off"
                              onChange={(event) => {
                                updateChangedMemberNickname({
                                  index: index,
                                  nickname: event.target.value,
                                });
                              }}
                            ></Form.Control>
                            {changedMemberNickname != {} &&
                              changedMemberNickname["index"] == index && (
                                <Button
                                  onClick={() => editMembership(member)}
                                  variant="success"
                                >
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                  ></FontAwesomeIcon>
                                </Button>
                              )}
                          </Form.Group>
                        </Form>
                      </Col>
                      <Col>
                        <Button
                          variant="danger"
                          onClick={() =>
                            deleteMembership(member["edit_api_url"])
                          }
                        >
                          <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            )}
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Ajouter quelqu'un:</Form.Label>
                <Form.Control
                  type="text"
                  onInput={(event) => {
                    getStudents(event.target.value);
                  }}
                  placeholder="Jean"
                  autoComplete="off"
                />
                {searchedStudents.length > 0 &&
                  searchedStudents.map((suggestion) => (
                    <div>
                      <Button onClick={() => selectStudent(suggestion)}>
                        {suggestion.name}
                        {" P"}
                        {suggestion.promo}
                      </Button>
                      <br />
                    </div>
                  ))}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Button
            onClick={() => {
              props.close();
            }}
          >
            Close
          </Button>
        </Modal>
      )}
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
