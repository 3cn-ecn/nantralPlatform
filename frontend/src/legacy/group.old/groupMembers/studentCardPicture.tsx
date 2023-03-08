import * as React from 'react';
import { makeNiceDate } from './utils';

import { StudentCardBodyProps } from './interfaces';
import { iconStyle, centerWrapper } from './styles';

export function StudentCardPicture(props: StudentCardBodyProps): JSX.Element {
  const { editMode, member } = props;

  const picture =
    member.student.picture !== null
      ? member.student.picture
      : `https://avatars.dicebear.com/api/avataaars/${member.student.name}.svg`;

  if (editMode) {
    return (
      <div className="col-3">
        <div style={centerWrapper}>
          <div className="ratio ratio-1x1">
            <img
              src={picture}
              style={iconStyle}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="col-3">
      <a href={member.student.url}>
        <div style={centerWrapper}>
          <div className="ratio ratio-1x1">
            <img
              // TODO: Enlever le nom de domaine ici
              src={
                picture.includes('https://')
                  ? picture
                  : `https://nantral-platform.fr${picture}`
              }
              style={iconStyle}
            />
          </div>
        </div>
      </a>
    </div>
  );
}
