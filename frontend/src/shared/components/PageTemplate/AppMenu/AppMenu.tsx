import { useState } from 'react';

import { Icon, IconButton } from '@mui/material';

import { AppMenuPanel } from './components/AppMenuPanel';

export function AppMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setMenuOpen(!menuOpen)}
        size="large"
        edge="start"
        aria-label="menu"
        component="span"
      >
        <Icon
          component="img"
          src="/static/img/icons/cropped/menu.svg"
          alt="Ouvrir le menu"
        />
      </IconButton>
      <AppMenuPanel menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
