import React, { useState, useRef } from "react";
import ReactDOM, { render } from "react-dom";
import {Spinner, Tabs, Tab, Dropdown} from "react-bootstrap";
import {SentNotification} from "./interfaces";
import merge from "./utils";
import getCookie from "../utils/getCookie";

declare const notifications_url: string;

/**
 * Fonction principale de chargement des notifications
 * @param props Propriétés de l'élément html
 * @returns Le code html à afficher
 */
function NotificationMenu(props): JSX.Element {
  const [nbSubNotifs, setNbSubNotifs] = useState <number> (null);
  const [nbAllNotifs, setNbAllNotifs] = useState <number> (null);
  const [listNotifs, setListNotifs] = useState <SentNotification[]> (null);
  const nbMaxDefault = 20;
  var nbMax = nbMaxDefault;  
  const csrfToken = getCookie('csrftoken');
  const api_url = notifications_url;

  if (nbSubNotifs === null) {
    getNbSubNotifs();
  }

  async function getNbSubNotifs(): Promise<void> {
    fetch(api_url+"?count=sub")
      .then(resp => resp.json().then(
        data => setNbSubNotifs(data)
      ))
      .catch(err => setNbSubNotifs(null));
  }

  async function getNbAllNotifs(): Promise<void> {
    fetch(api_url+"?count=all")
      .then(resp => resp.json())
      .then(data => setNbAllNotifs(data))
      .catch(err => setNbAllNotifs(null));
  }

  async function getListNotifs(subOnly:boolean): Promise<void> {
    const urlToRequest = api_url + "?sub=" + subOnly + "&nb=" + nbMax;
    fetch(urlToRequest)
      .then(resp => resp.json())
      .then(data => setListNotifs(merge(data, listNotifs)))
      .catch(err => {});
  }


  // component for one notification in the list
  function NotificationItem(props): JSX.Element {
    const index = props.index;
    const sn = listNotifs[index];
    const n = sn.notification;

    function makeRequest() {
      const urlToRequest = api_url + "?notif_id=" + n.id;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ title: 'Mark a notification as read' })
      };
      return fetch(urlToRequest, requestOptions);
    }

    function updateSeenPropertyInList(newVal:boolean) {
      var newList = JSON.parse(JSON.stringify(listNotifs));
      newList[index]['seen'] = newVal;
      setListNotifs(newList);
    }

    function updateSeen(event: React.MouseEvent<HTMLLinkElement>) {
      // update the seen property
      event.stopPropagation();
      updateSeenPropertyInList(null);
      makeRequest()
        .then(resp => resp.json())
        .then(data => {
          // mettre à jour la liste des notifs
          updateSeenPropertyInList(data);
          // mettre à jour le compteur
          if (data) {
            if (sn.subscribed) setNbSubNotifs(nbSubNotifs - 1);
            setNbAllNotifs(nbAllNotifs - 1);
          } else {
            if (sn.subscribed) setNbSubNotifs(nbSubNotifs + 1);
            setNbAllNotifs(nbAllNotifs + 1);
          }
        })
        .catch(err => updateSeenPropertyInList(sn.seen));
      return true;
    }

    function openItem() {
      // update the seen property
      updateSeenPropertyInList(null);
      if (sn.seen) {
        window.open(n.url, "_self");
      } else {
        makeRequest().finally(() => window.open(n.url, "_self"));
      }
    }

    return (
      <li>
        <a className="dropdown-item d-flex p-0">
          <span 
            className={`text-${sn.seen ? "light" : "danger"} read-button`}
            onClick={updateSeen}
          >
            { sn.seen == null ?
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            :
              "●"
            }
          </span>
          <span
            className="dropdown-item text-wrap d-flex p-1 ps-0 w-100" style={{alignItems: "center"}}
            onClick={()=>openItem()}
          >
            { n.icon_url ?
              <img src={n.icon_url} loading="lazy" />
            :
              <img src="/static/img/logo.svg" loading="lazy" />
            }
            <small className="ms-2"><strong>{n.title}</strong><br/>{n.body}</small>
          </span>
        </a>
      </li>
    );
  }
  
  // component for the list of all notifications
  function NotificationPanel(props) : JSX.Element {
    let content;
    if (listNotifs == null) {
      content = <li><small className="dropdown-item-text">Chargement...</small></li>;
    } else if (listNotifs.length == 0) {
      content = <li><small className="dropdown-item-text">Aucune notification ! Abonnez-vous à des pages pour en recevoir 😉</small></li>;
    } else {
      content = listNotifs.map((item, key) => <NotificationItem key={key} index={key}/>)
    }
    return(
      <>
        <li><h5 className="dropdown-item-text">Notifications</h5></li>
        <li><hr className="dropdown-divider" /></li>
        {/* <Tabs defaultActiveKey="sub" id="notifpanel" className="tab-justified">
          <Tab eventKey="sub" title="Abonné">
            {content}
          </Tab>
          <Tab eventKey="all" title="Tous">
            <p>Rien ici 😛</p>
          </Tab>
        </Tabs> */}
        { content }
      </>
    );
  }
  
  // open the menu
  function toggleMenu(nextShow: boolean, meta: any) {
    console.log("Load...");
    if (listNotifs == null) getListNotifs(true);
    if (nbAllNotifs == null) getNbAllNotifs();
  }

  return (
    <Dropdown onToggle={toggleMenu}>
      <Dropdown.Toggle 
        as="a"
        id="notification-icon"
        className="nav-link dropdown-toggler"
        role="button"
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
      </Dropdown.Toggle>
      <Dropdown.Menu 
        as="ul"
        className="overflow-auto"
      >
        <NotificationPanel></NotificationPanel>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function loadNotificationMenu() {
  render(
    <NotificationMenu />, 
    document.getElementById("notificationPanel")
  );
}

export default loadNotificationMenu;