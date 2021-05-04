import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactDOM, { render } from "react-dom";
import {Button, Card, Modal, Form} from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function EditHousing(props){
    const [searchedStudents, updateSearchedStuents] = useState([]);
    const [roommates, updateRoommates] = useState([]);
    const [showModal, updateShowModal] = useState(false);
    const [currentColocName, updateCurrentColocName] = useState(null);
    const [currentColocStart, updateCurrentColocStart] = useState(null);
    useEffect(() => {
        getRoommates()
    }, []);
    function createRoommates(){
        axios.post(props.roommates_api_url,{
            'name': currentColocName,
            'start': currentColocStart
        })
    }
    function getStudents(search: string){
        fetch(`${props.student_url}?search=${search}`)
        .then((resp) => resp.json()
        .then((students) => {
            updateSearchedStuents(searchedStudents);
        }))
    }
    function getRoommates(){
        fetch(props.roommates_api_url)
        .then((resp) => resp.json()
        .then((roommatesGroups) => {
            updateRoommates(roommatesGroups)
        }))
    }
    return(
        <div>
            <h2>Qui est passé par là:</h2>
            {roommates.length > 0 && <div>
                {roommates.map(roommateGroup => (
                    <Card>
                        <Card.Header>{roommateGroup['name']}</Card.Header>
                        <Card.Body>
                            {roommateGroup['members'].map(member => <p>
                                {member['first_name']} {member['last_name']} {member['last_name']} {member['nickname']}
                            </p>)}
                        </Card.Body>
                    </Card>
                ))}
                </div>}
                <Button onClick={() =>updateShowModal(!showModal)}>Ajouter une nouvelle coloc ?</Button>
            <Modal show={showModal}>
                <Form>


                </Form>
                <Modal.Footer>
                    <Form>
                        <Form.Group controlId="name">
                            <Form.Label>Nom de votre coloc:</Form.Label>
                            <Form.Control type="text" onInput={(event) => {updateCurrentColocName(event.target.value)}} placeholder="10 Rue de la Bléterie" />
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.Label>Date d'emenagement:</Form.Label>
                            <Form.Control type="date" onInput={(event) => {updateCurrentColocStart(event.target.value)}} placeholder="10 Rue de la Bléterie" />
                        </Form.Group>
                    </Form>
                    <Button onClick={() => updateShowModal(!showModal)} variant="secondary">Fermer</Button>
                    <Button onClick={() => {
                        createRoommates();
                        updateShowModal(!showModal);
                        }} variant="success">Enregistrer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}


render(<EditHousing student_url={student_url} roommates_api_url={roommates_api_url}/>, document.getElementById("root"));