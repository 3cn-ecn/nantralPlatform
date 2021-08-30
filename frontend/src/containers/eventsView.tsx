import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Button, Modal, CloseButton } from "react-bootstrap";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Truncate from "react-truncate";

var dayjs = require("dayjs");
var isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);
var isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);
require("dayjs/locale/fr");
dayjs.locale("fr");

const spinnerDivStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  fontSize: "5rem",
};

const spinnerStyle: CSSProperties = {
  width: 75,
  height: 75,
};

interface Student {
  name: string;
  get_absolute_url: string;
}

interface Urls {
  add: string;
  remove: string;
  participants: string;
}

interface EventInfos {
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
  is_participating: boolean;
  is_member: boolean;
}

const eventLink: React.CSSProperties = {
  color: "white",
};

const cardStyle: React.CSSProperties = {
  boxShadow: "1px 1px 7px #999",
};

function ParticipateButton(props): JSX.Element {
  const urls: Urls = props.urls;
  const eventInfos: EventInfos = props.eventInfos;

  const [isParticipating, setIsParticipating] = useState(
    eventInfos.is_participating
  );
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    props.number_of_participants
  );
  const [isLoading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
  const [participants, setParticipants] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => setShowModal(true);

  const faIconStyle: CSSProperties = {
    marginRight: 7,
  };
  return (
    <div className="btn-group" role="group">
      <Button variant="secondary" size="sm">
        <i className="fas fa-users" style={faIconStyle}></i>
        {numberOfParticipants}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setLoading(true);
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
            })
            .finally(() => setLoading(false));
        }}
      >
        {(() => {
          if (isParticipating) {
            return (
              <>
                <i className="fas fa-times" style={faIconStyle}></i>
                {isLoading ? "Chargement..." : "Je ne participe plus"}
              </>
            );
          }
          return (
            <>
              <i className="fas fa-check" style={faIconStyle}></i>
              {isLoading ? "Chargement..." : "Je participe"}
            </>
          );
        })()}
      </Button>
      {(() => {
        if (eventInfos.is_member) {
          return (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsParticipantsLoading(true);
                handleOpen();
                axios
                  .get(urls.participants.replace("1", eventInfos.slug))
                  .then((res) => {
                    setParticipants(res.data);
                  })
                  .catch((err) => {
                    setParticipants([]);
                  })
                  .finally(() => setIsParticipantsLoading(false));
              }}
            >
              <i className="fas fa-list" style={faIconStyle}></i>
              {"Liste des participant.e.s"}
            </Button>
          );
        }
      })()}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Liste des participant.e.s</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isParticipantsLoading ? (
            <div style={spinnerDivStyle}>
              <CircularProgress style={spinnerStyle} />
            </div>
          ) : (
            <ul>
              {participants.map((e: Student) => {
                return (
                  <>
                    <li>
                      <a href={e.get_absolute_url}>{e.name}</a>
                    </li>
                  </>
                );
              })}
            </ul>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

function Event(props): JSX.Element {
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
        <Truncate lines={3}>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: eventInfos.description }}
          ></p>
        </Truncate>
      </div>
    </div>
  );
}

function Root(props): JSX.Element {
  const [eventInfos, setEventInfos] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getEvents(): Promise<void> {
      await axios
        .get(props.eventsApiUrl)
        .then((res) => {
          let events: EventInfos[] = res.data;
          let orderedEventsInfoMap = new Map();
          for (let event of events) {
            let eventReadableDate = getDate(event.date);
            let orderedEventsInfo = orderedEventsInfoMap.get(eventReadableDate);
            if (orderedEventsInfo != undefined) {
              orderedEventsInfo.push(event);
              orderedEventsInfoMap.set(eventReadableDate, orderedEventsInfo);
            } else {
              orderedEventsInfoMap.set(eventReadableDate, [event]);
            }
          }
          setEventInfos(orderedEventsInfoMap);
        })
        .catch((err) => {
          setEventInfos(new Map());
        })
        .finally(() => setIsLoading(false));
    }
    getEvents();
  }, []);

  if (isLoading) {
    return (
      <div style={spinnerDivStyle}>
        <CircularProgress style={spinnerStyle} />
      </div>
    );
  }

  return (
    <>
      {Array.from(eventInfos, (events, key) => {
        return (
          <div key={key + "outerdiv"}>
            <h3>{events[0]}</h3>
            {events[1].map((el, i) => {
              return (
                <div key={key + i.toString() + "innerdiv"}>
                  <Event
                    key={key + i.toString()}
                    eventInfos={el}
                    urls={{
                      add: props.eventsAddParticipant,
                      remove: props.eventsRemoveParticipant,
                      participants: props.eventListParticipants,
                    }}
                  />
                  <br />
                </div>
              );
            })}
            <br />
          </div>
        );
      })}
    </>
  );
}

render(
  <Root
    eventsApiUrl={eventsApiUrl}
    eventsRemoveParticipant={eventsRemoveParticipant}
    eventsAddParticipant={eventsAddParticipant}
    eventListParticipants={eventListParticipants}
  />,
  document.getElementById("root")
);

function getDate(date: Date): string {
  if (dayjs(date).isToday()) {
    return "Aujourd'hui";
  }

  if (dayjs(date).isTomorrow()) {
    return "Demain";
  }
  return dayjs(date).format("dddd D MMMM");
}
