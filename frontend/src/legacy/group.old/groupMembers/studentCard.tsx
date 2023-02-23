import * as React from 'react';

import { StudentCardBody } from './studentCardBody';

import { Member } from './interfaces';
import { centerWrapper } from './styles';
import { StudentCardPicture } from './studentCardPicture';

export function StudentCard(props): JSX.Element {
  const member: Member = props.member;
  const editMode: boolean = props.editMode;

  if (editMode) {
    return (
      <div
        className="col-12 col-sm-6 col-lg-4 col-xxl-3 d-grid"
        style={props.sortStyle ? props.sortStyle : null}
        ref={props.newRef ? props.newRef : null}
      >
        <div className="btn btn-light student">
          <div className="row g-3">
            <div className="col-1" {...props.attributes} {...props.listeners}>
              <div style={centerWrapper}>
                <i className="fas fa-bars"></i>
              </div>
            </div>
            <StudentCardPicture editMode={editMode} member={member} />
            <StudentCardBody editMode={editMode} member={member} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xxl-3 d-grid">
      <div className="btn btn-light student">
        <div className="row g-3">
          <StudentCardPicture editMode={editMode} member={member} />
          <StudentCardBody editMode={editMode} member={member} />
        </div>
      </div>
    </div>
  );
}
