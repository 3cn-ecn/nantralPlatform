import * as React from "react";
import ReactDOM, { render } from "react-dom";


function GoBackMain(): JSX.Element {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return (
			<div id="goBackButton" className="d-inline-block pe-3" onClick={(e)=>window.history.back()}>
        <i aria-hidden="true" className="fas fa-chevron-left"></i>
      </div>
    );
  }
}

render(
  <GoBackMain
  />,
  document.getElementById("goBackButton")
);
