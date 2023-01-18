import { Button } from '@mui/material';
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import Person from '@mui/icons-material/PermIdentity';
import CheckboxListSecondary from './list';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  return (
    <>
      {/* <CheckboxListSecondary /> */}
      <h1>Home</h1>
      <p>Bienvenue sur Nantral Plateforme</p>

      <Button variant="outlined" startIcon={<Person />}>
        Je Participe
      </Button>
      <p>
        Ex fugiat ullamco mollit deserunt in. Magna elit cillum nostrud ullamco
        Lorem commodo qui officia minim amet est quis minim. Fugiat aliquip
        cupidatat cillum exercitation ullamco veniam. Ex magna non culpa
        incididunt aliqua fugiat excepteur fugiat quis elit duis.
      </p>
    </>
  );
}

export default Home;
