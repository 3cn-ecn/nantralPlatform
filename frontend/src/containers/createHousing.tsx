import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM, { render } from "react-dom";
import { Form, Button, Modal, ListGroup, Alert } from "react-bootstrap";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function CreateHousing(props) {
	const [currentHousing, updateCurrentHousing] = useState({});
	const [alreadyExists, updateAlreadyExists] = useState("");
	const [suggestions, updateSuggestions] = useState([]);
	const [showModal, updateShowModal] = useState(false);

	function getSuggestions(search: string) {
		if (search.length > 5) {
			fetch(
				props.geo_url + `?search_string=${encodeURI(search)}`
			).then((resp) =>
				resp.json().then((suggs) => {
					updateSuggestions(suggs);
				})
			);
		}
	}

	function selectAddress(address: string) {
		updateCurrentHousing({
			address: address,
		});
		updateSuggestions([]);
		axios
			.post(props.check_url, {
				address: address,
			})
			.then((resp) => {
				updateAlreadyExists(resp.data);
			});
	}

	function updateDetails(details: string) {
		updateCurrentHousing({
			address: currentHousing["address"],
			details: details,
		});
	}

	function submitHousing() {
		axios.post(props.api_url, currentHousing).then((resp) => {
			updateAlreadyExists(resp.data["edit_url"]);
			updateShowModal(true);
		});
	}

	return (
		<div>
			<h1>Ajouter une coloc</h1>
			<Form autocomplete="off">
				<Form.Group controlId="address">
					<Form.Label>Où se situe la coloc ?</Form.Label>
					<Form.Control
						onInput={(event) => {
							getSuggestions(event.target.value);
						}}
						placeholder="10 Rue de la Bléterie"
					/>
				</Form.Group>
				<ListGroup>
					{suggestions.length > 0 &&
						suggestions.map((suggestion) => (
							<ListGroup.Item action
								onClick={() => selectAddress(suggestion.place_name)}
							>
								{suggestion.place_name}
							</ListGroup.Item>
						))}
				</ListGroup>
			</Form>
			{currentHousing["address"] != null && (
				<div>
					<br />
					{alreadyExists != "" && (
						<Alert variant='warning'>
							Cette habitation semble déjà exister, vous pouvez la retrouver{" "}
							<Alert.Link href={alreadyExists}>ici</Alert.Link>.
						</Alert>
					)}
					<Form>
						<h1>{currentHousing["address"]}</h1>
						<Form.Group controlId="details">
							<Form.Label>Complément d'addresse</Form.Label>
							<Form.Control
								onInput={(event) => {
									updateDetails(event.target.value);
								}}
								placeholder="Appart 101"
							/>
						</Form.Group>
					</Form>
					<Button
						onClick={() => {
							submitHousing();
						}}
					>
						Créer le bâti
					</Button>
					<Modal show={showModal}>
						<Modal.Header>
							<p>L'habitation a été enregistré!</p>
						</Modal.Header>
						<Modal.Footer>
							<Button href={props.map_url} variant="secondary">
								Voir sur la carte
							</Button>
							<Button href={alreadyExists} variant="success">
								Ajouter les habitants
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			)}
		</div>
	);
}


render(
	<CreateHousing api_url={api_url} check_url={check_url} map_url={map_url} geo_url={geo_url} />,
	document.getElementById("root")
);
