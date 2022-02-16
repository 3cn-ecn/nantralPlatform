import React from "react";
import ReactDOM, { render } from "react-dom";


async function redirectToLoginPage(): Promise<void> {
  var current_url = window.location.pathname;
  fetch("/doihavetologin?path="+current_url)
    .then(resp => resp.json().then(data => {
      var havetologin = data;
      if (havetologin) {
        window.open(
          "/account/login?next=" + current_url,
          "_self"
        )
      };
    }))
    .catch(err => {
      render(
        <footer>Mode Hors-Connexion</footer>,
        document.getElementById("offline-alert")
      );
    });
}


export default redirectToLoginPage;