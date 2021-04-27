import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactDOM, { render } from "react-dom";
import {Form,  Button, Accordion} from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'



function CreateHousing(props) {
  const [currentHousing, updateCurrentHousing] = useState({});
  const [suggestions, updateSuggestions] = useState([]);
  function getSuggestions(search: string) {
    if (search.length > 5) {
      fetch(`/api/roommates/geocoding/?search_string=${encodeURI(search)}`)
      .then((resp) => resp.json()
      .then(suggs => {
        updateSuggestions(suggs)}));
    }
  }
  function selectAddress(address: string){
    updateCurrentHousing({
      'address': address
    });
    updateSuggestions([]);
  }
  function updateDetails(details: string){
    updateCurrentHousing({
      'address': currentHousing['address'],
      'details': details
    });
  }
  function submitHousing(){
    axios.post(props.api_url, currentHousing)
    .then()
  }

  return (
      <div>
          <h1>Commençons par le bati</h1>
          <Form>
            <Form.Group controlId="address">
            <Form.Label>Où se situe la coloc ?</Form.Label>
            <Form.Control onInput={(event) => {getSuggestions(event.target.value)}} placeholder="10 Rue de la Bléterie" />
            </Form.Group>
            {suggestions.length > 0 && suggestions.map(suggestion => <div><Button onClick={()=> selectAddress(suggestion.place_name)}>
              {suggestion.place_name}
            </Button>
            <br />
          </div>)}
          </Form>
          {currentHousing['address'] != null &&  
          <div>
            <Form>
            <h1>{currentHousing['address']}</h1>
            <Form.Group controlId="details">
            <Form.Label>Complément d'addresse</Form.Label>
            <Form.Control onInput={(event) => {updateDetails(event.target.value)}} placeholder="Appart 101" />
            </Form.Group>
            </Form>
          <Button onClick={() => {submitHousing()}}>
            Créer le bâti
          </Button>
          </div>
          }
      </div>

  );
}

document.body.style.margin = "0";
render(<CreateHousing api_url={api_url}/>, document.getElementById("root"));