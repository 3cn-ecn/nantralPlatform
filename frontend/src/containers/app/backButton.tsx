import React from "react";
import ReactDOM, { render } from "react-dom";


function GoBackMain(): JSX.Element {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return (
			<div className="d-inline-block pe-2" onClick={(e)=>window.history.back()}>
        <i aria-hidden="true" className="fas fa-arrow-left"></i>
      </div>
    );
  } else {
    return (<></>)
  }
}

async function loadBackButton() {
  render(
    <GoBackMain />,
    document.getElementById("goBackButton")
  );
}

export default loadBackButton;