import { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';

import { useMarkAsSeenMutation } from '#modules/notification/hooks/useMarkAsSeen.mutation';
import { SentNotification } from '#modules/notification/notification.types';
import { Avatar } from '#shared/components/Avatar/Avatar';

interface NotificationItemProps {
  notification: SentNotification;
  onClose: () => void;
}

export function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const { markAsSeen, markAsUnseen, isPending } = useMarkAsSeenMutation(
    notification.id,
  );

  const handleItemClick = () => {
    markAsSeen();
    onClose();
  };

  const handleSeenMarkClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (notification.seen) {
      markAsUnseen();
    } else {
      markAsSeen();
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={notification.url}
        onClick={handleItemClick}
        sx={{ gap: 1 }}
      >
        <Avatar alt={notification.title} src={notification.iconUrl} size="m" />
        <Stack sx={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
          <Typography variant="caption" noWrap>
            {notification.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {notification.body}
          </Typography>
        </Stack>
        <Box>
          <IconButton
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleSeenMarkClick}
            edge="end"
            sx={{ width: 28, height: 28 }}
          >
            {isPending ? (
              <CircularProgress size={12} thickness={6} />
            ) : (
              <Typography
                color={notification.seen ? 'text.disabled' : 'primary'}
                component="span"
                sx={{ opacity: notification.seen ? 0.3 : 1 }}
              >
                ●
              </Typography>
            )}
          </IconButton>
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
