import { Send } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { resendVerificationEmailApi } from '#modules/account/api/resendVerificationEmail.api';
import { Email } from '#modules/account/email.type';
import { DeleteMenuItem } from '#modules/account/view/Email/MenuItems/DeleteMenuItem';
import { SetMainMenuItem } from '#modules/account/view/Email/MenuItems/SetMainMenuItem';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';

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
  const showToast = useToast();
  const { mutate: resendEmail } = useMutation<number, ApiError, string>({
    mutationFn: (email) => resendVerificationEmailApi(email),
    onSuccess: async () => {
      showToast({
        message: t('email.more.resendSuccess'),
        variant: 'success',
      });
    },
    onError: async () => {
      showToast({
        message: t('email.more.resendError'),
        variant: 'error',
      });
    },
  });

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
              <MenuItem
                onClick={() => {
                  resendEmail(email.email);
                  handleClose();
                }}
              >
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
