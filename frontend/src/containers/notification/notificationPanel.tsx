import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import {Button} from "react-bootstrap";
import {SentNotification} from "./interfaces";
import {NotificationItem} from "./notificationItem";

/**
 * Fonction principale de chargement des notifications
 * @param props Propriétés de l'élément html
 * @returns Le code html à afficher
 */
function NotificationPanel(props): JSX.Element {
  const [nbSubNotifs, setNbSubNotifs] = useState <number> (props.nbNotifs);
  const [nbAllNotifs, setNbAllNotifs] = useState <number> (null);
  const [listSubNotifs, setListSubNotifs] = useState <SentNotification[]> (null);
  const [listAllNotifs, setListAllNotifs] = useState <SentNotification[]> (null);
  const nbMaxDefault = 20;
  const [nbMaxNotifs, setNbMaxNotifs] = useState <number> (nbMaxDefault);
  const [showOnlySub, setShowOnlySub] = useState <boolean> (true);
  const [showPanel, setShowPanel] = useState(false);

  async function getNbSubNotifs(): Promise<void> {
    fetch(props.url+"?count=sub")
      .then(resp => resp.json())
      .then(data => setNbSubNotifs(data))
      .catch(err => setNbSubNotifs(null))
  }

  async function getNbAllNotifs(): Promise<void> {
    fetch(props.url+"?count=all")
      .then(resp => resp.json())
      .then(data => setNbAllNotifs(data))
      .catch(err => setNbAllNotifs(null))
  }

  async function getListSubNotifs(): Promise<void> {
    fetch(props.url+"?sub=true&nb="+nbMaxNotifs)
      .then(resp => resp.json())
      .then(data => setListSubNotifs(data))
      .catch(err => setListSubNotifs(null))
  }

  async function getListAllNotifs(): Promise<void> {
    fetch(props.url+"?sub=false&nb="+nbMaxNotifs)
      .then(resp => resp.json())
      .then(data => setListAllNotifs(data))
      .catch(err => setListAllNotifs(null))
  }

  function loadMoreNotifs() {
    setNbMaxNotifs(nbMaxNotifs + nbMaxDefault);
  }

  // render the icon
  let iconBadge;
  if (nbSubNotifs > 0) {
    iconBadge = 
      <span 
        className="position-absolute translate-middle badge rounded-pill bg-danger" 
        style={{left:'80%', top:'20%', zIndex:5}}
      >
        { nbSubNotifs }
        <span className="visually-hidden">{ nbSubNotifs } nouvelles notifications</span>
      </span>;
  }

  // render the inner pannel
  let innerPanel;
  if (showOnlySub) {
    if (listSubNotifs == null) {
      innerPanel = <li><small className="dropdown-item-text">Chargement...</small></li>;
    } else if (listSubNotifs == []) {
      innerPanel = <li><small className="dropdown-item-text">Aucune notification pour l'instant !</small></li>;
    } else {
      innerPanel = listSubNotifs.map(sn => <NotificationItem content={sn}/>);
    }
  } else {
    if (listAllNotifs == null) {
      innerPanel = <li><small className="dropdown-item-text">Chargement...</small></li>;
    } else if (listAllNotifs == []) {
      innerPanel = <li><small className="dropdown-item-text">Aucune notification pour l'instant !</small></li>;
    } else {
      innerPanel = listAllNotifs.map(sn => <NotificationItem content={sn}/>);
    }
  }

  // display the menu
  return (
    <>
      <a 
        className={showPanel ? "nav-link show" : "nav-link"} href="#"
        onClick={() => {setShowPanel(!showPanel); getListSubNotifs();}}
      >
        <img 
          src = '/static/icon/notification.svg'
          className="d-inline-block align-top" 
          alt="notifications" 
          loading="lazy"
        />
        { iconBadge }
      </a>
      <ul 
        className={showPanel ?
          "dropdown-menu dropdown-menu-end overflow-auto show" :
          "dropdown-menu dropdown-menu-end overflow-auto"}
        style={{width: "18rem", maxWidth: "90vw", right: "-42px", maxHeight: "70vh"}}
      >
        <li><h5 className="dropdown-item-text">Notifications</h5></li>
        <li><hr className="dropdown-divider" /></li>
        { innerPanel }
      </ul>
    </>
  );
}


render(
  <NotificationPanel url={notifications_url} nbNotifs={nbNotifs} />, 
  document.getElementById("notificationPanel")
);
  

