import { Box, ListItem, Skeleton } from '@mui/material';

import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function NotificationItemSkeleton() {
  return (
    <ListItem sx={{ gap: 1 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <FlexCol flex={1}>
        <Skeleton variant="text" width="60%" sx={{ fontSize: 12 }} />
        <Skeleton variant="text" width="100%" sx={{ fontSize: 14 }} />
      </FlexCol>
      <Box marginRight={-1.5}>
        <Skeleton
          variant="circular"
          width={12}
          height={12}
          sx={{ margin: 1 }}
        />
      </Box>
    </ListItem>
  );
}
