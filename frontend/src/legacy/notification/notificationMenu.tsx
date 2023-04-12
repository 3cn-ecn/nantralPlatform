import React, { useState } from 'react';
import ReactDOM, { render } from 'react-dom';
import { Spinner, Dropdown, Button } from 'react-bootstrap';
import { Settings, SettingsOutlined } from '@mui/icons-material';

import { IconButton } from '@mui/material';
import axios from '../utils/axios';
import formatUrl from '../utils/formatUrl';

import { SentNotification } from './interfaces';
import merge from './utils';
import { GET_NOTIFICATIONS_URL, MANAGE_NOTIFICATION_URL } from './api_urls';

/**
 * Fonction principale de chargement des notifications
 * @param props Propriétés de l'élément html
 * @returns Le code html à afficher
 */
function NotificationMenu(props): JSX.Element {
  const [onLoad, setOnLoad] = useState<boolean>(true);
  const [notifOnLoad, setNotifOnLoad] = useState<boolean>(false);
  const [nbNotifs, setNbNotifs] = useState<number>(null);
  const [listNotifs, setListNotifs] = useState<SentNotification[]>([]);
  const [subscribeFilter, setSubscribeFilter] = useState<boolean>(false);
  const [unseenFilter, setUnseenFilter] = useState<boolean>(false);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const [askPermissionBanner, setAskPermissionBanner] = useState<boolean>(
    'Notification' in window && Notification.permission === 'default'
      ? true
      : false
  );
  const step: number = 10;

  if (nbNotifs === null) {
    getNbNotifs();
  }

  async function getNbNotifs(): Promise<void> {
    const url = formatUrl(GET_NOTIFICATIONS_URL, [], { mode: 1 });
    fetch(url)
      .then((resp) => resp.json().then((data) => setNbNotifs(data)))
      .catch((err) => setNbNotifs(null));
  }

  async function getListNotifs(): Promise<void> {
    setOnLoad(true);
    const start = listNotifs.length;
    const url = formatUrl(GET_NOTIFICATIONS_URL, [], {
      mode: 2,
      start: start,
      nb: step,
    });
    fetch(url)
      .then((resp) =>
        resp.json().then((data) => {
          let merging = merge(listNotifs, data);
          setListNotifs(merging);
          setOnLoad(false);
          if (merging.length < start + step) setAllLoaded(true);
        })
      )
      .catch((err) => {
        setOnLoad(false);
      });
  }

  function askPermission(event): void {
    Notification.requestPermission().then(() => {
      setAskPermissionBanner(Notification.permission === 'default');
    });
  }

  // component for one notification in the list
  function NotificationItem(props): JSX.Element {
    let sn = props.sn;
    let n = sn.notification;

    async function updateSeen(event: React.MouseEvent<HTMLLinkElement>) {
      // update the seen property
      event.stopPropagation();
      var previous = sn.seen;
      sn.seen = null;
      setNotifOnLoad(true);
      const url = formatUrl(MANAGE_NOTIFICATION_URL, [n.id]);
      axios
        .post(url, {})
        .then((resp) => {
          // mettre à jour la liste des notifs
          sn.seen = resp.data;
          // mettre à jour le compteur
          if (resp.data) {
            setNbNotifs(nbNotifs - 1);
          } else {
            setNbNotifs(nbNotifs + 1);
          }
          setNotifOnLoad(false);
        })
        .catch((err) => (sn.seen = previous));
      return true;
    }

    function openItem() {
      // update the seen property
      setNotifOnLoad(true);
      sn.seen = null;
      if (sn.seen) {
        window.open(n.url, '_self');
      } else {
        const url = formatUrl(MANAGE_NOTIFICATION_URL, [n.id]);
        axios.post(url, {}).finally(() => window.open(n.url, '_self'));
      }
    }

    return (
      <li className={sn.seen ? '' : 'bg-light'}>
        <a className="dropdown-item d-flex p-0">
          <span
            className="dropdown-item text-wrap d-flex pe-0 w-100"
            style={{ alignItems: 'center' }}
            onClick={openItem}
          >
            {n.icon_url ? (
              <img src={n.icon_url} loading="lazy" />
            ) : (
              <img src="/static/img/logo/logo.svg" loading="lazy" />
            )}
            <small className="ms-2">
              <strong>{n.title}</strong>
              <br />
              {n.body}
            </small>
          </span>
          <span
            className={`text-${sn.seen ? 'light' : 'danger'} read-button`}
            onClick={updateSeen}
          >
            {sn.seen == null ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              '●'
            )}
          </span>
        </a>
      </li>
    );
  }

  // component for the list of all notifications
  function NotificationPanel(props): JSX.Element {
    let content;
    let listToShow = listNotifs.filter((sn: SentNotification) => {
      let res = true;
      if (unseenFilter) res = res && !sn.seen;
      if (subscribeFilter) res = res && sn.subscribed;
      return res;
    });
    if (listToShow.length == 0) {
      if (!onLoad) {
        content = (
          <li>
            <small className="dropdown-item-text">Aucune notification 😢</small>
          </li>
        );
      }
    } else {
      content = listToShow.map((sn) => (
        <NotificationItem key={sn.notification.id} sn={sn} />
      ));
    }
    return (
      <>
        <li>
          <div className="d-flex dropdown-item-text mb-0">
            <h5 className="pt-2">Notifications</h5>
            <IconButton
              href="/notification/settings"
              className="ms-auto text-secondary"
            >
              <SettingsOutlined />
            </IconButton>
          </div>
        </li>
        {askPermissionBanner ? (
          <li className="">
            <span className="dropdown-item-text bg-dark text-light text-center mt-1 mb-1">
              <small>Les notifications sont désactivées&nbsp;😢</small>
              <Button
                variant="light"
                size="sm"
                className="m-1"
                onClick={askPermission}
              >
                Activer
              </Button>
            </span>
          </li>
        ) : (
          <></>
        )}
        <li>
          <span className="dropdown-item-text">
            <Button
              variant={subscribeFilter ? 'danger' : 'outline-danger'}
              size="sm"
              className="rounded-pill"
              onClick={() => setSubscribeFilter(!subscribeFilter)}
            >
              Abonné
            </Button>
            &nbsp;
            <Button
              variant={unseenFilter ? 'danger' : 'outline-danger'}
              size="sm"
              className="rounded-pill"
              onClick={() => setUnseenFilter(!unseenFilter)}
            >
              Non lu
            </Button>
          </span>
        </li>
        {content}
        {onLoad ? (
          <li>
            <small className="dropdown-item-text mb-3">
              Chargement... <Spinner animation="border" size="sm" />
            </small>
          </li>
        ) : allLoaded ? (
          <></>
        ) : (
          <li>
            <span className="dropdown-item-text">
              <Button variant="secondary" size="sm" onClick={getListNotifs}>
                Charger plus
              </Button>
            </span>
          </li>
        )}
      </>
    );
  }

  // to do when the we open the menu
  async function loadNotifications(nextShow: boolean, meta: any) {
    if (onLoad) getListNotifs();
  }

  return (
    <Dropdown onToggle={loadNotifications} align="end">
      <Dropdown.Toggle
        as="a"
        id="notification-icon"
        className="nav-link dropdown-toggler"
        role="button"
      >
        <img
          src="/static/img/icons/scalable/notification.svg"
          className="d-inline-block align-top"
          alt="notifications"
          loading="lazy"
        />
        {nbNotifs > 0 ? (
          <span
            className="position-absolute translate-middle badge rounded-pill bg-danger"
            style={{ left: '80%', top: '20%', zIndex: 5 }}
          >
            {nbNotifs}
            <span className="visually-hidden">
              {nbNotifs} nouvelles notifications
            </span>
          </span>
        ) : (
          <></>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu as="ul">
        <NotificationPanel></NotificationPanel>
      </Dropdown.Menu>
    </Dropdown>
  );
}

async function loadNotificationMenu() {
  render(<NotificationMenu />, document.getElementById('notificationPanel'));
}

export default loadNotificationMenu;
