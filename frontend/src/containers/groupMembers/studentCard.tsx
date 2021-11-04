import * as React from "react";
import { makeNiceDate } from "./utils";

import { Member } from "./interfaces";
import {
  h5Style,
  iconStyle,
  smallStyle,
  centerWrapper,
  textWrapper,
} from "./styles";

export function StudentCard(props): JSX.Element {
  const member: Member = props.member;
  const editMode: boolean = props.editMode;
  const picture =
    member.student.picture !== null
      ? member.student.picture
      : "/static/img/logo.svg";
  const date_begin = makeNiceDate(member.date_begin);
  const date_end = makeNiceDate(member.date_end);

  if (member.year != null) {
    var memberTimeSpan = `Année en cours ${member.year}`;
  } else if (member.date_begin == null) {
    var memberTimeSpan = ``;
  } else {
    var memberTimeSpan =
      date_end === null
        ? `Membre depuis le ${date_begin}`
        : `Membre du ${date_begin} au ${date_end}`;
  }
  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xxl-3 d-grid">
      <a className="btn btn-light student" href={member.student.absolute_url}>
        <div className="row g-3">
          {editMode ? (
            <div className="col-1">
              <div style={centerWrapper}>
                <i
                  className="fas fa-bars"
                  {...props.attributes}
                  {...props.listeners}
                ></i>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="col-3">
            <div style={centerWrapper}>
              <div className="ratio ratio-1x1">
                <img
                  // TODO: Enlever le nom de domaine ici
                  src={
                    picture.includes("https://")
                      ? picture
                      : `https://nantral-platform.fr${picture}`
                  }
                  style={iconStyle}
                />
              </div>
            </div>
          </div>
          <div className="col text-start">
            <div style={textWrapper}>
              <div>
                <h5 style={h5Style}>{member.student.name}</h5>
                <span>{member.function}</span>
                <br />
                <small style={smallStyle}>
                  <i>{memberTimeSpan}</i>
                </small>
                <br />
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
