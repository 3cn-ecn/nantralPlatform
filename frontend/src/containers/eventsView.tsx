import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Spinner } from "react-bootstrap";
import { getDate } from "./eventsView/utils";
import { Event } from "./eventsView/event";
import { spinnerDivStyle, spinnerStyle } from "./eventsView/styles";
import { EventInfos } from "./eventsView/interfaces";

function Root(props): JSX.Element {
  const [eventInfos, setEventInfos] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getEvents(): Promise<void> {
      await fetch(props.eventsApiUrl)
        .then((resp) => {
          resp.json().then((data) => {
            let events: EventInfos[] = data;
            let orderedEventsInfoMap = new Map();
            for (let event of events) {
              let eventReadableDate = getDate(event.date);
              let orderedEventsInfo =
                orderedEventsInfoMap.get(eventReadableDate);
              if (orderedEventsInfo != undefined) {
                orderedEventsInfo.push(event);
                orderedEventsInfoMap.set(eventReadableDate, orderedEventsInfo);
              } else {
                orderedEventsInfoMap.set(eventReadableDate, [event]);
              }
            }
            setEventInfos(orderedEventsInfoMap);
          });
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
        <Spinner animation="border" role="status" style={spinnerStyle} />
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
