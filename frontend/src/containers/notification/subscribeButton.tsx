import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import {Button, Spinner} from "react-bootstrap";
import {getCookie} from "./utils";

/**
 * Load the Subscribe Button and update it when clicked
 * @param props Properties of the XML element
 * @returns HTML Button element
 */
function SubscribeButton(props): JSX.Element {
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const csrfToken = getCookie('csrftoken');

  /**
   * Load the state of the subscription
   */
  async function getSubscription(): Promise<void> {
    await fetch(props.getSubscriptionURL)
      .then(resp => resp.json())
      .then(data => {setSubscribed(data); setIsLoading(false);})
      .catch(err => getSubscription());
  }

  /**
   * Change the state of the subscription
   */
  function changeSubscription(): void {
    setIsLoading(true);
    const requestOptions = {
      method: (subscribed ? 'DELETE' : 'POST'), //Delete the sub if already subscribed, else create it
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken              //important ! cookie for authentification
      },
      body: JSON.stringify({ title: 'Change the subscription' })
    };
    fetch(props.getSubscriptionURL, requestOptions)
      .then(resp => {setSubscribed(!subscribed); setIsLoading(false);})
      .catch(err => {getSubscription();});
  }

  // call the state loader in a parallel process
  useEffect(() => {
    getSubscription();
  }, []);

  // while we don't know the state, display loading
  if (isLoading) {
      return <>
        <Button variant="dark" size="sm">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          &nbsp; {subscribed ? "Abonné !" : "S'abonner"}
        </Button>
      </>;
  }

  // display the button with the right text
  return (
    <Button variant="dark" size="sm" onClick={()=>changeSubscription()}>
      {subscribed ? 
        <><i className="fas fa-bell"></i>&nbsp; Abonné !</> : 
        <><i className="far fa-bell"></i>&nbsp; S'abonner</>
      }
    </Button>
  );
}


render(
  <SubscribeButton getSubscriptionURL={getSubscriptionURL} />, 
  document.getElementById("subscription_button")
);
  
