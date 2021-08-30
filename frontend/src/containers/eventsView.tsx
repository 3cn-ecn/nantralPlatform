import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM, { render } from "react-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

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
      <h3>{eventInfos.date}</h3>
      <div className={`card pt-0 bg-${eventInfos.color}`} style={cardStyle}>
        <div className="card-body">
          <a
            href={eventInfos.get_absolute_url}
            style={eventLink}
            className="mb-1"
          >
            {" "}
            <h5 className="card-title">
              {eventInfos.title} • Début : {eventInfos.date} •{" "}
              {eventInfos.location}
            </h5>
            <h6 className="card-subtitle mb-2">{eventInfos.group}</h6>
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
