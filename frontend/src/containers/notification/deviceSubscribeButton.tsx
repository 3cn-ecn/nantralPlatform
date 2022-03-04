import React, { useState } from "react";
import ReactDOM, { render } from "react-dom";
import {Button} from "react-bootstrap";


/**
 * Load the Subscribe Button and update it when clicked
 * @param props Properties of the XML element
 * @returns HTML Button element
 */
function DeviceSubscribeButton(props): JSX.Element {

    const [notificationState, setNotificationState] = useState("unsupported");

    async function askForNotifications(event) {
        Notification.requestPermission().then(() => {
            setNotificationState(Notification.permission);
        });
    }

    if (notificationState === "unsupported" && 'Notification' in window) {
        setNotificationState(Notification.permission);
    }

    if (notificationState === "granted") {
        return <p>Les notifications sont activées ! 🥳 Abonnez-vous
                à des pages pour recevoir leurs notifications !</p>;
    } else if (notificationState === "default") {
        return <p><span>Les notifications sont désactivées 😢  </span>
                  <Button size="sm" onClick={askForNotifications}>Activer !</Button></p>;
    } else if (notificationState === "denied") {
        return <p>Vous avez bloqué les notifications... 😢 Activez-les dans vos paramètres !</p>
    } else {
        return <p>Votre appareil ne peut pas supporter les notifications pour Nantral 
                Platform, toutes nos excuses... 😢</p>
    }

}


render(
    <DeviceSubscribeButton />, 
    document.getElementById("subscribe_to_notifications")
);
    
  