import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import {Button} from "react-bootstrap";

/**
 * Function for the reading of a cookie
 * @param name Name of the cookie
 * @returns Value of the cookie
 */
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

/**
 * Load the Subscribe Button and update it when clicked
 * @param props Properties of the XML element
 * @returns HTML Button element
 */
function SubscribeButton(props): JSX.Element {
  const [subscribed, setSubscribed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const csrfToken = getCookie('csrftoken');

  /**
   * Load the state of the subscription
   */
  async function getSubscription(): Promise<void> {
    await fetch(props.getSubscriptionURL)
      .then(resp => resp.json())
      .then(data => setSubscribed(data))
      .catch(err => setSubscribed(null))
      .finally(() => setIsLoading(false));
  }

  /**
   * Change the state of the subscription
   */
  function changeSubscription(): void {
    const requestOptions = {
      method: (subscribed ? 'DELETE' : 'POST'), //Delete the sub if already subscribed, else create it
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken              //important ! cookie for authentification
      },
      body: JSON.stringify({ title: 'Change the subscription' })
    };
    fetch(props.getSubscriptionURL, requestOptions)
      .then(resp => setSubscribed(!subscribed))
      .catch(err => {setSubscribed(null); getSubscription();});
  }

  // call the state loader in a parallel process
  useEffect(() => {
    getSubscription();
  }, []);

  // while we don't know the state, display nothing
  if (isLoading || subscribed == null) {
    return <></>;
  }

  // display the button with the right text
  return (
    <>
      <Button variant="dark" size="sm" onClick={()=>changeSubscription()}>
        <i></i>
        {subscribed ? 
          <><i className="fas fa-bell"></i>&nbsp; Abonné</> : 
          <><i className="far fa-bell"></i>&nbsp; S'abonner</>
        }
      </Button>
    </>
  );
}


render(
  <SubscribeButton getSubscriptionURL={getSubscriptionURL} />, 
  document.getElementById("subscription_button")
);
  
