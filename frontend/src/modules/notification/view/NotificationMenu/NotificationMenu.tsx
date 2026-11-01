import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  DoneAll as DoneAllIcon,
  SettingsOutlined as SettingsOutlinedIcon,
} from '@mui/icons-material';
import {
  Badge,
  Chip,
  CircularProgress,
  Collapse,
  Icon,
  IconButton,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';

import { useMarkAllAsSeenMutation } from '#modules/notification/hooks/useMarkAllAsSeen.mutation';
import { useNotificationCountQuery } from '#modules/notification/hooks/useNotificationCount.query';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { NotificationAskConsentBanner } from './NotificationAskConsentBanner';
import { NotificationMenuContent } from './NotificationMenuContent';

export function NotificationMenu() {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subscribedFilter, setSubscribedFilter] = useState(false);
  const [unseenFilter, setUnseenFilter] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const newNotificationCountQuery = useNotificationCountQuery({
    seen: false,
  });
  const { markAllAsSeen, isPending } = useMarkAllAsSeenMutation();

  const nbNewNotifications = newNotificationCountQuery.data || 0;

  return (
    <>
      <IconButton
        size="large"
        aria-label={t('notification.aria-label', { nb: nbNewNotifications })}
        onClick={handleClick}
        id="notification-button"
      >
        <Badge badgeContent={nbNewNotifications} color="primary">
          <Icon
            component="img"
            src="/static/img/icons/cropped/notification.svg"
            alt="Notifications"
          />
        </Badge>
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        TransitionComponent={Collapse}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              maxWidth: '90%',
              height: 600,
              maxHeight: '90%',
            },
          },
        }}
      >
        <FlexCol height="100%">
          <FlexRow alignItems="center" px={2} pt={1}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {t('notification.title')}
            </Typography>
            <Tooltip title={t('notification.markAllAsSeen')}>
              <IconButton
                color="secondary"
                onClick={() => markAllAsSeen()}
                disabled={isPending}
              >
                {isPending ? (
                  <CircularProgress
                    color="secondary"
                    size="0.9em"
                    thickness={5}
                  />
                ) : (
                  <DoneAllIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title={t('notification.settings')}>
              <IconButton
                component={Link}
                to="/notification/settings/"
                reloadDocument
                onClick={handleClose}
                color="secondary"
                sx={{ mr: -1 }}
              >
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>
          </FlexRow>
          <NotificationAskConsentBanner />
          <FlexRow gap={1} px={2} py={1}>
            <Chip
              variant={subscribedFilter ? 'filled' : 'outlined'}
              label={t('notification.subscribed')}
              color="primary"
              onClick={() => setSubscribedFilter(!subscribedFilter)}
            />
            <Chip
              variant={unseenFilter ? 'filled' : 'outlined'}
              label={t('notification.unseen')}
              color="primary"
              onClick={() => setUnseenFilter(!unseenFilter)}
            />
          </FlexRow>
          <NotificationMenuContent
            isOpen={isMenuOpen}
            onClose={handleClose}
            subscribedFilter={subscribedFilter}
            unseenFilter={unseenFilter}
          />
        </FlexCol>
      </Popover>
    </>
  );
}
