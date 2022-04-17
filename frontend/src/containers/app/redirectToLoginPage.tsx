import React from "react";
import ReactDOM, { render } from "react-dom";


async function redirectToLoginPage(): Promise<void> {
  var current_url = window.location.pathname;
  console.log("try to redirect");
  fetch("/doihavetologin?path="+current_url)
    .then(resp => resp.json().then(data => {
      console.log("sucess", data);
      var havetologin = data;
      if (havetologin) {
        window.open(
          "/account/login?next=" + current_url,
          "_self"
        )
      };
    }))
    .catch(err => {
      console.log("error");
      render(
        <div className="offline">Mode Hors-Connexion</div>,
        document.getElementById("footer-offline")
      );
    });
}


export default redirectToLoginPage;