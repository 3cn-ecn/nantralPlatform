import { ChangeEvent, useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';

import axios from '../utils/axios';
import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';

declare const API_URL: string;
declare const CHECK_URL: string;
declare const GEO_URL: string;
declare const CREATE_URL: string;

function Root() {
  const [currentHousing, updateCurrentHousing] = useState({});
  const [alreadyExists, updateAlreadyExists] = useState([]);
  const [suggestions, updateSuggestions] = useState([]);

  function getSuggestions(search: string) {
    if (search.length > 5) {
      fetch(GEO_URL + `?search_string=${encodeURI(search)}`).then((resp) =>
        resp.json().then((suggs) => {
          updateSuggestions(suggs);
        }),
      );
    }
  }

  function selectAddress(address: string) {
    updateCurrentHousing({
      address: address,
    });
    updateSuggestions([]);
    axios
      .post(CHECK_URL, {
        address: address,
      })
      .then((resp) => {
        updateAlreadyExists(resp.data);
      });
  }

  function updateDetails(details: string) {
    updateCurrentHousing({
      address: currentHousing['address'],
      details: details,
    });
  }

  function submitHousing(e) {
    e.preventDefault();
    axios.post(API_URL, currentHousing).then((resp) => {
      updateAlreadyExists(resp.data);
      location.href = CREATE_URL.replace('0', resp.data.id);
    });
  }

  return (
    <div>
      <h1>Ajouter ma coloc</h1>
      <Form autoComplete="off">
        <Form.Group controlId="address">
          <Form.Label>Adresse :</Form.Label>
          <Form.Control
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              getSuggestions(event.target.value);
            }}
            placeholder="10 Rue de la Bléterie"
          />
        </Form.Group>
        <ListGroup>
          {suggestions.length > 0 &&
            suggestions.map((suggestion) => (
              <ListGroup.Item
                action
                onClick={() => selectAddress(suggestion.place_name)}
              >
                {suggestion.place_name}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Form>
      {currentHousing['address'] != null && (
        <div>
          <br />
          <h5>{currentHousing['address']}</h5>
          {alreadyExists.length > 0 && (
            <div>
              <p>
                Cette adresse est déjà enregistrée ! Si votre coloc est située à
                la même adresse que l'une des colocs ci-dessous,
                sélectionnez-la. Sinon, créez une nouvelle adresse !
              </p>
              <ListGroup>
                {alreadyExists.map((housing) => (
                  <ListGroup.Item
                    action
                    href={CREATE_URL.replace('0', housing.pk)}
                  >
                    {housing.name}
                  </ListGroup.Item>
                ))}
                <ListGroup.Item action onClick={() => updateAlreadyExists([])}>
                  Créer une nouvelle adresse
                </ListGroup.Item>
              </ListGroup>
            </div>
          )}
          {alreadyExists.length == 0 && (
            <Form noValidate onSubmit={submitHousing}>
              <Form.Group controlId="details">
                <Form.Label>Complément d'addresse</Form.Label>
                <Form.Control
                  onInput={(event: ChangeEvent<HTMLInputElement>) => {
                    updateDetails(event.target.value);
                  }}
                  placeholder="Appart 101"
                />
              </Form.Group>
              <br />
              <Button type="submit">Continuer</Button>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}

wrapAndRenderLegacyCode(<Root />, 'root');
