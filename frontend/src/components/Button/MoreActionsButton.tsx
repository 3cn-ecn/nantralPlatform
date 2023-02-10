import * as React from 'react';
import './MoreActionsButton.scss';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useTranslation } from 'react-i18next';
import { IconButton, rgbToHex } from '@mui/material';

import Snackbar from '@mui/material/Snackbar';

import theme from '../../theme';

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
  slug: string;
  size?: string;
}) {
  const { t } = useTranslation('translation'); // translation module
  const { className, isAdmin, shareUrl, slug, size } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openCopyNotif, setOpenCopyNotif] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const editOption = isAdmin ? (
    <MenuItem
      onClick={() => {
        window.open(`event/${slug}/edit`, '_blank', 'noreferrer');
        handleClose();
      }}
    >
      <EditIcon className="itemIcon" />
      {t('event.action_menu.edit')}
    </MenuItem>
  ) : null;
  return (
    <div className={className}>
      <IconButton
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{
          minWidth: 0,
          padding: 0,
          width: `${size}`,
          height: `${size}`,
          fontSize: '1em',
        }}
      >
        <MoreHorizIcon
          style={{ width: `${size}`, height: `${size}`, fontSize: '1em' }}
          color="primary"
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            setOpenCopyNotif(true);
            handleClose();
          }}
        >
          <ShareIcon className="itemIcon" />
          {t('event.action_menu.share')}
        </MenuItem>
        {editOption}
        <MenuItem
          onClick={handleClose}
          style={{ color: rgbToHex(theme.palette.error.main) }}
        >
          <HighlightOffIcon
            style={{ color: rgbToHex(theme.palette.error.main) }}
            className="itemIcon"
          />
          {t('event.action_menu.unsubscribe')}
        </MenuItem>
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
  size: '1.6em',
};

export default MoreActionsButton;
