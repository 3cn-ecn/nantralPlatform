import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import {Button} from "react-bootstrap";
import {SentNotification} from "./interfaces";
import {getCookie} from "./utils";
import { LaptopWindows } from "@material-ui/icons";


/**
 * Fonction principale de chargement des notifications
 * @param props Propriétés de l'élément html
 * @returns Le code html à afficher
 */
function NotificationMenu(props): JSX.Element {
  const [showPanel, setShowPanel] = useState(false);
  const [nbSubNotifs, setNbSubNotifs] = useState <number> (props.nbNotifs);
  const [nbAllNotifs, setNbAllNotifs] = useState <number> (null);
  const [listSubNotifs, setListSubNotifs] = useState <SentNotification[]> (null);
  const [listAllNotifs, setListAllNotifs] = useState <SentNotification[]> (null);
  const nbMaxDefault = 20;
  var nbMax = nbMaxDefault;  
  const csrfToken = getCookie('csrftoken');
  const api_url = props.url;

  async function getNbSubNotifs(): Promise<void> {
    fetch(api_url+"?count=sub")
      .then(resp => resp.json())
      .then(data => setNbSubNotifs(data))
      .catch(err => setNbSubNotifs(null))
  }

  async function getNbAllNotifs(): Promise<void> {
    fetch(api_url+"?count=all")
      .then(resp => resp.json())
      .then(data => setNbAllNotifs(data))
      .catch(err => setNbAllNotifs(null))
  }

  async function getListSubNotifs(): Promise<void> {
    fetch(api_url+"?sub=true&nb="+nbMax)
      .then(resp => resp.json())
      .then(data => setListSubNotifs(data))
      .catch(err => setListSubNotifs(null))
  }

  async function getListAllNotifs(): Promise<void> {
    fetch(api_url+"?sub=false&nb="+nbMax)
      .then(resp => resp.json())
      .then(data => setListAllNotifs(data))
      .catch(err => setListAllNotifs(null))
  }

  function NotificationItem(props): JSX.Element {
    const index = props.index;
    const sn : SentNotification = props.item;
    const n = sn.notification;

    function markAsRead(openWindowAfter:boolean) {
      if (openWindowAfter && sn.seen) {
        window.open(n.url, "_self");
        return;
      }
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ title: 'Mark a notification as read' })
      };
      fetch(api_url+"?notif_id="+n.id, requestOptions)
        .then(resp => {
          if (openWindowAfter) {
            window.open(n.url, "_self");
          } else {
            var newList = JSON.parse(JSON.stringify(listSubNotifs));
            newList[index]['seen'] = !sn.seen;
            setListSubNotifs(newList);
            getNbSubNotifs();
          }
        })
        .catch(err => {});
    }

    return (
      <li>
        <span className="dropdown-item d-flex ps-1">
          <span 
            className={`text-${sn.seen ? "light" : "danger"} read-button`}
            onClick={()=>markAsRead(false)}
          >
            ●
          </span>
          <span 
            className="text-wrap d-flex" style={{alignItems: "center"}}
            onClick={()=>markAsRead(true)}
          >
            { n.icon_url ?
              <img src={n.icon_url} loading="lazy" />
            :
              <img src="static/img/logo.svg" loading="lazy" />
            }
            <small className="ms-2">{n.body}</small>
          </span>
        </span>
      </li>
    );
  }
  
  function NotificationPanel(props) : JSX.Element {
    let content;
    if (listSubNotifs == null) {
      content = <li><small className="dropdown-item-text">Chargement...</small></li>;
    } else if (listSubNotifs.length == 0) {
      content = <li><small className="dropdown-item-text">Aucune notification ! Abonnez-vous à des pages pour en recevoir 😉</small></li>;
    } else {
      content = listSubNotifs.map((item, key) => <NotificationItem key={key} item={item} index={key}/>)
    }
    return(
      <>
        <li><h5 className="dropdown-item-text">Notifications</h5></li>
        <li><hr className="dropdown-divider" /></li>
        {content}
      </>
    );
  }

  function updateShowPanel() {
    setShowPanel(!showPanel);
    if (listSubNotifs == null) {
      getListSubNotifs();
    }
  }
  
  // display the icon for notifications
  return (
    <>
      <a 
        className={`nav-link ${showPanel ? "show" : ""}`} href="#"
        onClick={updateShowPanel}
      >
        <img 
          src = '/static/icon/notification.svg'
          className="d-inline-block align-top" 
          alt="notifications" 
          loading="lazy"
        />
        { nbSubNotifs > 0 ?
          <span 
            className="position-absolute translate-middle badge rounded-pill bg-danger" 
            style={{left:'80%', top:'20%', zIndex:5}}
          >
            { nbSubNotifs }
            <span className="visually-hidden">{ nbSubNotifs } nouvelles notifications</span>
          </span> : <></>
        }
      </a>
      <ul 
        className={`dropdown-menu dropdown-menu-end overflow-auto ${showPanel ? "show" : ""}`}
        style={{width: "18rem", maxWidth: "90vw", right: "-42px", maxHeight: "70vh"}}
      >
        <NotificationPanel></NotificationPanel>
      </ul>
    </>
  );
}


render(
  <NotificationMenu url={notifications_url} nbNotifs={nbNotifs} />, 
  document.getElementById("notificationPanel")
);
  

