import { Send } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { Email } from '#modules/account/email.type';
import { DeleteMenuItem } from '#modules/event/view/Email/MenuItems/DeleteMenuItem';
import { SetMainMenuItem } from '#modules/event/view/Email/MenuItems/SetMainMenuItem';
import { useTranslation } from '#shared/i18n/useTranslation';

export function MoreActionMenu({
  email,
  anchorEl,
  setAnchorEl,
}: {
  email: null | Email;
  anchorEl: null | HTMLElement;
  setAnchorEl: (anchorEl: null | HTMLElement) => void;
}) {
  const { t } = useTranslation();

  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {email && (
        <>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {!email?.isMain && (
              <DeleteMenuItem email={email} handleClose={handleClose} />
            )}
            {!email.isMain && email.isValid && (
              <SetMainMenuItem email={email} handleClose={handleClose} />
            )}
            {!email?.isValid && (
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Send />
                </ListItemIcon>
                <ListItemText>{t('email.more.resend')}</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </>
      )}
    </>
  );
}
