import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Container from '@mui/material/Container';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Sign() {
  return (
    <Container maxWidth="sm">
      <h1>Signature</h1>
    </Container>
  );
}

export default Sign;
