import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import axios from '../../utils/axios';
import { Button, Card, Modal } from 'react-bootstrap';
var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

declare const API_URL: string;
declare const STATIC_URL_PREFIX: string;

function Root(props: {}) {
  const [show, setShow] = useState(false);
  const [currentEvent, updateCurrentEvent] = useState({});
  const [events, updateEvents] = useState([]);
  const handleClose = () => {
    updateCurrentEvent({});
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const getEvents = () => {
    fetch(API_URL).then((resp) =>
      resp.json().then((events) => {
        updateEvents(events);
      })
    );
  };
  useEffect(() => {
    getEvents();
  }, []);
  return (
    <div>
      {events.length > 0
        ? events.map((event) => (
            <div>
              <Card border={event.color}>
                <Card.Header as="h5">{event.title}</Card.Header>
                {event.image != null && (
                  <Card.Img
                    variant="top"
                    src={`${STATIC_URL_PREFIX}${event.image.url}`}
                  />
                )}
                <Card.Body>
                  <Card.Subtitle>Lieu : {event.location}</Card.Subtitle>
                  <Card.Subtitle>
                    Date :{' '}
                    {dayjs(event.date).format('dddd, MMMM Do YYYY, HH:mm')}
                  </Card.Subtitle>
                  <Card.Subtitle>Publicite : {event.publicity}</Card.Subtitle>
                  <Card.Subtitle>Description :</Card.Subtitle>
                  <Card.Text>{event.description}</Card.Text>
                  <Button href={`/event/${event.slug}/edit`} variant="primary">
                    Editer cet évènement.
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      updateCurrentEvent({
                        title: event.title,
                        slug: event.slug,
                        date: event.date,
                      });
                      handleShow();
                    }}
                  >
                    Supprimer cet évènement
                  </Button>
                </Card.Body>
                <Card.Footer className="text-center text-muted">
                  {dayjs(event.date).fromNow()}
                </Card.Footer>
              </Card>
            </div>
          ))
        : "C'est un peu mort par ici ... Ajoute vite un évènement, utilise les évenements archivés pour t'inspirer."}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Doucement ! On supprime ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>{currentEvent['title']}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Enfait non
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              axios.delete(`/api/event/${currentEvent['slug']}`).then(() => {
                handleClose();
                getEvents();
              });
            }}
          >
            Je confirme
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

render(<Root />, document.getElementById('root'));
