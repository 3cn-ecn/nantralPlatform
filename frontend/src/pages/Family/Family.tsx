import React from 'react';
import Container from '@mui/material/Container';
import EditSuggestionModal from '../Suggestion/Suggestion';
/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Family() {
  return (
    <>
      <Container maxWidth="sm">
        <h1>Family</h1>
      </Container>
      <EditSuggestionModal />
    </>
  );
}

export default Family;
