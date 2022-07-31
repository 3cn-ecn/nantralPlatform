import * as React from 'react';
import { Button } from 'react-bootstrap';

import { ColocInfoProps } from './interfaces';

export function ColocInfo(props: ColocInfoProps): JSX.Element {
  const { housing, colocathlonOnly } = props;
  let roommatesList: string = '';
  if (
    typeof housing.roommates != 'undefined' &&
    typeof housing.roommates.members != 'undefined' &&
    !colocathlonOnly
  ) {
    roommatesList = housing.roommates.members
      .map((e) => e.name)
      .join(', ')
      .replace(/(,\s*)$/, '');
  }
  return (
    <div>
      <div>
        <p>
          <strong>{housing.roommates.name}</strong>
          &nbsp;-&nbsp;
          <Button
            variant="primary"
            size="sm"
            href={`https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=${housing.address}`}
            target="_blank"
          >
            Y aller
          </Button>
          &nbsp;
          <Button
            variant="secondary"
            size="sm"
            href={housing.roommates.url}
            style={{ marginRight: '1rem' }}
          >
            Détails
          </Button>
          <br />
          <small>
            {housing.address}
            <br />
            <i>
              {colocathlonOnly
                ? `Horaires: ${housing.roommates.colocathlon_hours}`
                : housing.details}
            </i>
          </small>
        </p>
        <p>
          {colocathlonOnly
            ? housing.roommates.colocathlon_activities
            : roommatesList}
        </p>
      </div>
    </div>
  );
}
