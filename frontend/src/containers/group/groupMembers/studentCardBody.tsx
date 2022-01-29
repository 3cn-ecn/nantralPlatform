import * as React from "react";
import { makeNiceDate } from "./utils";

import { StudentCardBodyProps } from "./interfaces";
import { h5Style, smallStyle, textWrapper } from "./styles";

export function StudentCardBody(props: StudentCardBodyProps): JSX.Element {
  const { editMode, member } = props;

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

  if (editMode) {
    return (
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
    );
  }
  return (
    <div className="col text-start">
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
    </div>
  );
}
