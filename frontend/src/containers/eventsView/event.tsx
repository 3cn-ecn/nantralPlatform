import * as React from "react";
import { EventInfos } from "./interfaces";
import Truncate from "react-truncate";
import { cardStyle } from "./styles";
import { ParticipateButton } from "./participateButton";
import { Card } from "react-bootstrap";

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
    <Card border={eventInfos.color} style={cardStyle}>
      <Card.Img variant="top" src={eventInfos.image} />
      <Card.Body>
        <a
          href={eventInfos.get_absolute_url}
          className="mb-1 text-dark"
        >
          <Card.Title>
            {eventInfos.title}
          </Card.Title>
          <Card.Subtitle className="mb-3">
            {dayjs(eventInfos.date).format("HH:mm")} • {eventInfos.location} • {eventInfos.get_group_name}
          </Card.Subtitle>
        </a>
        <Card.Text>
          <ParticipateButton
            number_of_participants={eventInfos.number_of_participants}
            urls={urls}
            eventInfos={eventInfos}
          />
        </Card.Text>
        {/* <Truncate lines={3}>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: eventInfos.description }}
          ></p>
        </Truncate> */}
      </Card.Body>
    </Card>
  );
}
