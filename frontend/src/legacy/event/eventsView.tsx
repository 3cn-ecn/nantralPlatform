import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Row, Col } from 'react-bootstrap';

import { getGroupDate } from './eventsView/utils';
import { Event } from './eventsView/event';
import { EventInfos } from './eventsView/interfaces';

declare const eventsApiUrl: string;
declare const eventsRemoveParticipant: string;
declare const eventsAddParticipant: string;
declare const eventListParticipants: string;

// const eventsApiUrl: string = "api/event/";
// const eventsRemoveParticipant: string = "api/event/participating/1";
// const eventsAddParticipant: string = "/event/1/participants/delete/";
// const eventListParticipants: string = "/event/1/participants/add";

function Root(props: {}): JSX.Element {
  const [eventInfos, setEventInfos] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getEvents(): Promise<void> {
      await fetch(eventsApiUrl)
        .then((resp) => {
          resp.json().then((data) => {
            let events: EventInfos[] = data;
            let orderedEventsInfoMap = new Map();
            for (let event of events) {
              let eventReadableDate = getGroupDate(event.date);
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
    return <></>;
  }

  return (
    <>
      {Array.from(eventInfos, (events, key) => {
        return (
          <div key={key + 'outerdiv'}>
            <h3>{events[0]}</h3>
            <Row className="gx-2 mb-3 events">
              {events[1].map((el, i) => {
                return (
                  <Col
                    xs={12}
                    md={6}
                    xl={4}
                    key={key + i.toString() + 'innerdiv'}
                  >
                    <Event
                      key={key + i.toString()}
                      eventInfos={el}
                      urls={{
                        add: eventsAddParticipant,
                        remove: eventsRemoveParticipant,
                        participants: eventListParticipants,
                      }}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}
    </>
  );
}

render(<Root />, document.getElementById("root-events"));
