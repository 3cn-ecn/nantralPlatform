import React, { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import {Button, Spinner} from "react-bootstrap";

import axios from "../utils/axios";
import formatUrl from "../utils/formatUrl";

import { SUBSCRIPTION_URL } from "./api_urls";

const page_slug = (document.querySelector('meta[name="page"]') as HTMLMetaElement).content;
const subscriptionPageUrl = formatUrl(SUBSCRIPTION_URL, [page_slug]);


/**
 * Load the Subscribe Button and update it when clicked
 * @param props Properties of the XML element
 * @returns HTML Button element
 */
function SubscribeButton(props): JSX.Element {
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load the state of the subscription
   */
  async function getSubscription(): Promise<void> {
    await fetch(subscriptionPageUrl)
      .then(resp => resp.json().then(
        data => {setSubscribed(data); setIsLoading(false);}
      ))
      .catch(err => setIsLoading(false));
  }

  /**
   * Change the state of the subscription
   */
  function changeSubscription(): void {
    setIsLoading(true);
    if (subscribed) {
      axios.delete(subscriptionPageUrl, {})
        .then(resp => {setSubscribed(false); setIsLoading(false);})
        .catch(err => getSubscription());
    } else {
      axios.post(subscriptionPageUrl, {})
        .then(resp => {setSubscribed(true); setIsLoading(false);})
        .catch(err => getSubscription());
    }
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
  <SubscribeButton />, 
  document.getElementById("subscription_button")
);
  
