import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM, { render } from "react-dom";
import { Form, Button, Modal, Card } from "react-bootstrap";
var dayjs = require('dayjs');

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";


function AvailabilitiesEdit(props){

    return(
        <div>
            <CreateAvailability api_url={props.api_list_url}></CreateAvailability>
            <ListAvalabilities api_url={props.api_list_url}></ListAvalabilities>
        </div>
    )
}
function CreateAvailability(props){
    const [showModal, updateShowModal] = useState(false);
    const [startDate, updateStartDate] = useState(null);
    const [startTime, updateStartTime] = useState(null);
    const [endDate, updateEndDate] = useState(null);
    const [endTime, updateEndTime] = useState(null);
    const [quantity, updateQuantity] = useState(null);
    const [inifity, updateInifity] = useState(false);
    function handleClose(){
        updateShowModal(false);
        updateEndDate(null);
        updateStartDate(null);
        updateQuantity(null);
    }
    function sendAvailability(){
        axios.post(props.api_url, {
            start: dayjs(`${startDate} ${startTime}`),
            end: dayjs(`${endDate} ${endTime}`),
            quantity: quantity
        });
        handleClose();
    }
    return (
        <div>
            <Button variant='success' onClick={() => updateShowModal(true)}>+ Ajouter une disponibilité</Button>
            <Modal show={showModal}>
            <Modal.Header>
                <Modal.Title>
                    Ajout d'une disponibilité
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="start">
                        <Form.Label>Date de début:</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={(event) =>{
                                updateStartDate(event.target.value);
                            }}
                            required={true}
                        ></Form.Control>
                        <Form.Label>Heure de début:</Form.Label>
                        <Form.Control
                            type="time"
                            onChange={(event) => {
                                updateStartTime(event.target.value);
                            }}
                            required={true}
                        >
                        </Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Date de fin:</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={(event) =>{
                                updateEndDate(event.target.value);
                            }}
                            required={true}
                        ></Form.Control>
                        <Form.Label>Heure de fin:</Form.Label>
                        <Form.Control
                            type="time"
                            onChange={(event) => {
                                updateEndTime(event.target.value);
                            }}
                            required={true}
                        ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                        {!inifity && 
                        <Form.Group>
                            <Form.Label>Quantité disponible:</Form.Label>
                            <Form.Control
                            type="number"
                            onChange={(event) =>{
                                updateQuantity(event.target.value);
                            }}
                        ></Form.Control>
                        </Form.Group>
                        }             
                        <Form.Label>Quantité infini:</Form.Label>
                            <Form.Check
                            type="checkbox"
                            onChange={(event) =>{
                                updateInifity(event.target.value);
                            }}
                        ></Form.Check>

                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleClose()}>Annuler</Button>
                <Button variant="success" onClick={() => {sendAvailability()}}>Ajouter</Button>
            </Modal.Footer>
        </Modal>
        </div>
    )
}
function ListAvalabilities(props){
    const [availabilities, updateAvailabilities] = useState([]);
    function getAvailabilities(){
        axios.get(props.api_url).then(
            (resp) => {
                updateAvailabilities(resp.data);
            }
        );
    }
    useEffect(() => {
        getAvailabilities();
    }, []);
    return (
        <div>
            {availabilities.length > 0 && availabilities.map((availability) =>
                <Card>
                    <Card.Header as={'h5'}>{availability.start} - {availability.end}</Card.Header>
                    <Card.Body>Quantité: {availability.quantity}</Card.Body>
                </Card>
            )}
        </div>
    )
}

document.body.style.margin = "0";
render(
  <AvailabilitiesEdit api_list_url={api_list_url}/>,
  document.getElementById("root")
);
