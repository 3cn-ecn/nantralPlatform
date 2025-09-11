import { MoreHoriz } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { Email } from '#modules/account/email.type';

export function MoreActionButton({
  setAnchorEl,
  setEmail,
  email,
}: {
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
  setEmail: (email: null | Email) => void;
  email: Email;
}) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setEmail(email);
  };
  return (
    <IconButton onClick={handleClick}>
      <MoreHoriz />
    </IconButton>
  );
}
