import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export function SidebarTrigger({
  open,
  isDesktop,
  setSidebarOpen,
}: Readonly<{
  open: boolean;
  isDesktop: boolean;
  setSidebarOpen: (open: boolean) => void;
}>) {
  return (
    <IconButton
      onClick={() => setSidebarOpen(!open)}
      aria-label={open ? 'Fermer la sidebar' : 'Ouvrir la sidebar'}
      sx={{
        mr: 1,
      }}
    >
      {isDesktop ? (
        open ? (
          <CloseIcon />
        ) : (
          <MenuIcon />
        )
      ) : open ? (
        <CloseIcon />
      ) : (
        <MenuIcon />
      )}
    </IconButton>
  );
}
