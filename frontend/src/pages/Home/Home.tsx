import { Button } from '@mui/material';
import React from 'react';
import JoinButton from '../../components/Button/JoinButton';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  return (
    <>
      {/* <CheckboxListSecondary /> */}
      <h1>Home</h1>
      <div style={{ flexDirection: 'column' }}>
        <JoinButton variant="normal" person={5} maxPerson={10} />
        <JoinButton variant="shotgun" person={9} maxPerson={10} />
        <JoinButton
          variant="form"
          person={5}
          maxPerson={10}
          link="https://lerush.fr/edition2022"
        />
      </div>
    </>
  );
}

export default Home;
