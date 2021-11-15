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
        ? `A rejoint le ${date_begin}`
        : `Membre du ${date_begin} au ${date_end}`;
  }

  const body = editMode ? (
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
  ) : (
    <a href={member.student.absolute_url} style={{ color: "inherit" }}>
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
    </a>
  );

  const pictureDiv = editMode ? (
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
  ) : (
    <a href={member.student.absolute_url}>
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
    </a>
  );

  if (editMode) {
    return (
      <div
        className="col-12 col-sm-6 col-lg-4 col-xxl-3 d-grid"
        style={props.sortStyle ? props.sortStyle : null}
        ref={props.newRef ? props.newRef : null}
      >
        <div className="btn btn-light student">
          <div className="row g-3">
            {editMode ? (
              <div className="col-1" {...props.attributes} {...props.listeners}>
                <div style={centerWrapper}>
                  <i className="fas fa-bars"></i>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="col-3">{pictureDiv}</div>
            <div className="col text-start">{body}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="col-12 col-sm-6 col-lg-4 col-xxl-3 d-grid"
      style={props.sortStyle ? props.sortStyle : null}
      ref={props.newRef ? props.newRef : null}
      {...props.attributes}
      {...props.listeners}
    >
      <div className="btn btn-light student">
        <div className="row g-3">
          <div className="col-3">{pictureDiv}</div>
          <div className="col text-start">{body}</div>
        </div>
      </div>
    </div>
  );
}
