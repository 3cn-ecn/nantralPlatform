import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import {Button} from "react-bootstrap";

function getCookie(name) {
  if (!document.cookie) {
    return null;
  }
  const xsrfCookies = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));
  if (xsrfCookies.length === 0) {
    return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}

function SubscribeButton(props): JSX.Element {
  const [subscribed, setSubscribed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const csrfToken = getCookie('csrftoken');

  async function getSubscription(): Promise<void> {
    await fetch(props.getSubscriptionURL)
      .then(resp => resp.json())
      .then(data => setSubscribed(data))
      .catch(err => setSubscribed(null))
      .finally(() => setIsLoading(false));
  }

  function changeSubscription(): void {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({ title: 'Change the subscription' })
    };
    fetch(props.getSubscriptionURL, requestOptions)
      .then(resp => setSubscribed(!subscribed))
      .catch(err => {setSubscribed(null); getSubscription();});
  }

  useEffect(() => {
    getSubscription();
  }, []);

  if (isLoading || subscribed == null) {
    return <></>;
  }

  return (
    <>
      <Button variant="dark" size="sm" onClick={()=>changeSubscription()}>
        <i></i>
        {subscribed ? 
          <><i className="far fa-bell-slash"></i> Se désabonner</> : 
          <><i className="fas fa-bell"></i> S'abonner</>
        }
      </Button>
    </>
  );
}
  
render(
  <SubscribeButton getSubscriptionURL={getSubscriptionURL} />, 
  document.getElementById("subscription_button")
);
  
