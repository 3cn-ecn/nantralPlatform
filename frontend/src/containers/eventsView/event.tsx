import * as React from "react";
import { EventInfos } from "./interfaces";
import Truncate from "react-truncate";
import { cardStyle, eventLink } from "./styles";
import { ParticipateButton } from "./participateButton";

var dayjs = require("dayjs");
var isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);
var isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);
require("dayjs/locale/fr");
dayjs.locale("fr");

export function Event(props): JSX.Element {
  const urls = props.urls;
  const eventInfos: EventInfos = props.eventInfos;

  return (
    <div className={`card pt-0 bg-${eventInfos.color}`} style={cardStyle}>
      <div className="card-body">
        <a
          href={eventInfos.get_absolute_url}
          style={eventLink}
          className="mb-1"
        >
          {" "}
          <h5 className="card-title">
            {eventInfos.title}
          </h5>
          <h6 className="card-subtitle mb-3">
            {dayjs(eventInfos.date).format("HH:mm")} • {eventInfos.location} • {eventInfos.get_group_name}
          </h6>
        </a>
        <p className="card-subtitle mb-0">
          <ParticipateButton
            number_of_participants={eventInfos.number_of_participants}
            urls={urls}
            eventInfos={eventInfos}
          />
        </p>
        {/* <Truncate lines={3}>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: eventInfos.description }}
          ></p>
        </Truncate> */}
      </div>
    </div>
  );
}
