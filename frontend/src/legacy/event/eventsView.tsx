import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Row, Col } from 'react-bootstrap';

import { getGroupDate } from './eventsView/utils';
import { Event } from './eventsView/event';
import { EventInfos } from './eventsView/interfaces';

declare const groupSlug: string;

function Root(): JSX.Element {
  const [eventInfos, setEventInfos] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getEvents(): Promise<void> {
      await fetch(`/api/event/?group=${groupSlug}`)
        .then((resp) => {
          resp.json().then((data) => {
            const events: EventInfos[] = data.results;
            const orderedEventsInfoMap = new Map();
            events.forEach((event) => {
              const eventReadableDate = getGroupDate(event.start_date);
              const orderedEventsInfo =
                orderedEventsInfoMap.get(eventReadableDate);
              if (orderedEventsInfo !== undefined) {
                orderedEventsInfo.push(event);
                orderedEventsInfoMap.set(eventReadableDate, orderedEventsInfo);
              } else {
                orderedEventsInfoMap.set(eventReadableDate, [event]);
              }
            });
            setEventInfos(orderedEventsInfoMap);
          });
        })
        .catch(() => {
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
          <div key={`${key}outerdiv`}>
            <h3>{events[0]}</h3>
            <Row className="gx-2 mb-3 events">
              {events[1].map((el, i) => {
                return (
                  <Col
                    xs={12}
                    md={6}
                    xl={4}
                    key={`${key + i.toString()}innerdiv`}
                  >
                    <Event key={key + i.toString()} eventInfos={el} />
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

render(<Root />, document.getElementById('root-events'));
