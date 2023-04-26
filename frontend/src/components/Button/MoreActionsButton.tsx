import * as React from 'react';
import { useTranslation } from 'react-i18next';

import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, rgbToHex, useTheme } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';

import JoinButton from './JoinButton';
import './MoreActionsButton.scss';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MoreActionsButton(props: {
  className: string;
  isAdmin: boolean; // Show or hide the link to the edit page
  shareUrl: string;
  id: number;
  participating: boolean;
  setParticipating: React.Dispatch<React.SetStateAction<boolean>>;
  size?: string;
}) {
  const { t } = useTranslation('translation'); // translation module
  const {
    className,
    isAdmin,
    shareUrl,
    id,
    size,
    participating,
    setParticipating,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openCopyNotif, setOpenCopyNotif] = React.useState(false);
  const theme = useTheme();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const editOption = isAdmin ? (
    <MenuItem
      onClick={() => {
        window.open(`event/${id}/edit`, '_blank', 'noreferrer');
        handleCloseMenu();
      }}
    >
      <EditIcon className="itemIcon" />
      {t('event.action_menu.edit')}
    </MenuItem>
  ) : null;

  const unregisterOption = participating ? (
    <JoinButton
      variant="normal"
      onClick={handleCloseMenu}
      person={1}
      maxPerson={2}
      participating={participating}
      setParticipating={setParticipating}
      eventId={id}
      link=""
      startRegistration={null}
      endRegistration={null}
      unregisterOnly
    />
  ) : null;
  return (
    <div className={className}>
      <IconButton
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          minWidth: 0,
          padding: '1.2rem',
          background: rgbToHex(theme.palette.secondary.main).concat('b5'),
          width: `${size}`,
          height: `${size}`,
          fontSize: '1rem',
          '&:hover': {
            background: rgbToHex(theme.palette.primary.main).concat('b5'),
          },
        }}
      >
        <MoreHorizIcon
          style={{ width: `${size}`, height: `${size}`, fontSize: '1rem' }}
          color="primary"
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            setOpenCopyNotif(true);
            handleCloseMenu();
          }}
        >
          <ShareIcon className="itemIcon" />
          {t('event.action_menu.share')}
        </MenuItem>
        {editOption}
        {unregisterOption}
      </Menu>
      <Snackbar
        open={openCopyNotif}
        autoHideDuration={2000}
        onClose={() => setOpenCopyNotif(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('event.action_menu.linkCopied')}
        </Alert>
      </Snackbar>
    </div>
  );
}

MoreActionsButton.defaultProps = {
  size: '1.6rem',
};

export default MoreActionsButton;
