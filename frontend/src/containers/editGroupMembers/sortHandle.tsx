import * as React from "react";

import { centerWrapper } from "../groupMembers/styles";

export function SortHandle(props): JSX.Element {
  if (props.attributes && props.listeners) {
    return (
      <div className="col-1" {...props.attributes} {...props.listeners}>
        <div style={centerWrapper}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
    );
  } else {
    return (
      <div className="col-1">
        <div style={centerWrapper}>
          <i className="fas fa-bars"></i>
        </div>
      </div>
    );
  }
}
