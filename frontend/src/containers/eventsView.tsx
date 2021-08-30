﻿import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM, { render } from "react-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
var dayjs = require("dayjs");
var isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);
var isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);
require("dayjs/locale/fr");
dayjs.locale("fr");

interface urls {
  add: string;
  remove: string;
}

interface eventInfos {
  title: string;
  group: string;
  description: string;
  location: string;
  date: Date;
  publicity: string;
  color: string;
  image: string;
  slug: string;
  number_of_participants: number;
  get_absolute_url: string;
  get_group_name: string;
}

const eventLink: React.CSSProperties = {
  color: "white",
};

const cardStyle: React.CSSProperties = {
  boxShadow: "1px 1px 7px #999",
};

function ParticipateButton(props): JSX.Element {
  const urls: urls = props.urls;
  const eventInfos: eventInfos = props.eventInfos;
  const [isParticipating, setIsParticipating] = useState(true);
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    props.number_of_participants
  );
  return (
    <div className="btn-group" role="group">
      <Button variant="secondary" color="muted" size="sm">
        {numberOfParticipants}
        <i className="fas fa-users"></i>
      </Button>
      <Button
        variant="secondary"
        color="muted"
        size="sm"
        onClick={() => {
          axios
            .get(
              isParticipating
                ? urls.remove.replace("1", eventInfos.slug)
                : urls.add.replace("1", eventInfos.slug)
            )
            .then(() => {
              let offset = isParticipating ? -1 : 1;
              setIsParticipating(!isParticipating);
              setNumberOfParticipants(numberOfParticipants + offset);
            });
        }}
      >
        {(() => {
          return isParticipating ? "Je ne participe plus" : "Je participe";
        })()}
      </Button>
    </div>
  );
}

function Event(props): JSX.Element {
  const urls = props.urls;
  const eventInfos: eventInfos = props.eventInfos;
  const [isParticipant, setIsParticipant] = useState(true);

  return (
    <div>
      <h3>{getDate(eventInfos.date)}</h3>
      <div className={`card pt-0 bg-${eventInfos.color}`} style={cardStyle}>
        <div className="card-body">
          <a
            href={eventInfos.get_absolute_url}
            style={eventLink}
            className="mb-1"
          >
            {" "}
            <h5 className="card-title">
              {eventInfos.title} • Début :{" "}
              {dayjs(eventInfos.date).format("HH:mm")} • {eventInfos.location}
            </h5>
            <h6 className="card-subtitle mb-2">{eventInfos.get_group_name}</h6>
          </a>
          <h6 className="card-subtitle mb-2">
            <ParticipateButton
              number_of_participants={eventInfos.number_of_participants}
              urls={urls}
              eventInfos={eventInfos}
            />
          </h6>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: eventInfos.description }}
          ></p>
        </div>
      </div>

      <br />
      <br />
    </div>
  );
}

function Root(props): JSX.Element {
  const [eventInfos, setEventInfos] = useState([]);
  useEffect(() => {
    async function getEvents(): Promise<void> {
      await axios
        .get(props.eventsApiUrl)
        .then((res) => {
          setEventInfos(res.data);
        })
        .catch((err) => {
          setEventInfos([]);
        });
    }
    getEvents();
  }, []);
  return (
    <>
      {eventInfos.map((e, i) => (
        <Event
          key={i}
          eventInfos={e}
          urls={{
            add: props.eventsRemoveParticipant,
            remove: props.eventsRemoveParticipant,
          }}
        />
      ))}
    </>
  );
}

render(
  <Root
    eventsApiUrl={eventsApiUrl}
    eventsRemoveParticipant={eventsRemoveParticipant}
    eventsAddParticipant={eventsAddParticipant}
  />,
  document.getElementById("root")
);

function getDate(date: Date): string {
  if (dayjs(date).isToday) {
    return "Aujourd'hui";
  }
  if (dayjs(date).isTomorrow) {
    return "Demain";
  }
  return dayjs(date).format("dddd D MMMM");
}
