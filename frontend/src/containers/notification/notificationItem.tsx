import * as React from "react";
import { SentNotification } from "./interfaces";

export function NotificationItem(props): JSX.Element {
  const sn : SentNotification = props.content;
  const n = sn.notification;

  return (
    <li>
      <a className="dropdown-item text-wrap d-flex" href={sn.notification.url}>
        { n.icon_url ?
          <img src={n.icon_url} loading="lazy" />
        :
          <img src="static/img/logo.svg" loading="lazy" />
        }
        <small className="ms-2">{n.body}</small>
      </a>
    </li>
  );
}
