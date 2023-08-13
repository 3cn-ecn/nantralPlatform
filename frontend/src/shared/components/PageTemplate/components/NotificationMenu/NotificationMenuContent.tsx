import { Box, List, Typography } from '@mui/material';

import { useNotificationListQuery } from '#modules/notification/hooks/useNotificationList.query';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { NotificationItem } from './NotificationItem';
import { NotificationItemSkeleton } from './NotificationItemSkeleton';

type NotificationMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  subscribedFilter: boolean;
  unseenFilter: boolean;
};

export function NotificationMenuContent({
  isOpen,
  onClose,
  subscribedFilter,
  unseenFilter,
}: NotificationMenuProps) {
  const { t } = useTranslation();
  const showToast = useToast();

  const notificationListQuery = useNotificationListQuery(
    {
      subscribed: subscribedFilter ? true : undefined,
      seen: unseenFilter ? false : undefined,
      pageSize: 10,
    },
    { enabled: isOpen }
  );

  if (notificationListQuery.isError) {
    showToast({
      variant: 'error',
      message: notificationListQuery.error.message,
    });
  }

  if (!notificationListQuery.isSuccess) {
    return (
      <Box overflow="auto">
        <List>
          {Array.from({ length: 6 }).map((_, index) => (
            <NotificationItemSkeleton key={index} />
          ))}
        </List>
      </Box>
    );
  }

  return (
    <Box overflow="auto">
      <List>
        {notificationListQuery.data.pages.map((page) =>
          page.results.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onClose={onClose}
            />
          ))
        )}
      </List>
      <Box sx={{ px: 2, pb: 2 }}>
        {notificationListQuery.hasNextPage ? (
          <LoadingButton
            size="small"
            onClick={() => notificationListQuery.fetchNextPage()}
            color="secondary"
            variant="contained"
            loading={notificationListQuery.isFetchingNextPage}
          >
            {t('notification.loadMore')}
          </LoadingButton>
        ) : (
          <Typography
            color="secondary"
            textAlign="center"
            variant="body2"
            mt={1}
          >
            {t('notification.endOfList')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
