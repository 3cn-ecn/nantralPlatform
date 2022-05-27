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
        return <p>Les notifications sont activées&nbsp;!&nbsp;🥳 Abonnez-vous
                à des pages pour recevoir leurs notifications&nbsp;!</p>;
    } else if (notificationState === "default") {
        return <p><span>Les notifications sont désactivées&nbsp;😢&nbsp; </span>
                  <Button size="sm" onClick={askForNotifications}>Activer&nbsp;!</Button></p>;
    } else if (notificationState === "denied") {
        return <p>Vous avez bloqué les notifications...&nbsp;😢 Activez-les dans vos paramètres&nbsp;</p>
    } else {
        return <p>Votre appareil/navigateur n'est pas compatible avec les notifications 
                pour Nantral Platform...&nbsp;😢</p>
    }

}


render(
    <DeviceSubscribeButton />, 
    document.getElementById("subscribe_to_notifications")
);
    
  