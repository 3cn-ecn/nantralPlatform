import { Skeleton, Stack, Typography } from '@mui/material';

import { AVATAR_SIZES, AvatarSize } from '#shared/components/Avatar/Avatar';

export function GroupItemSkeleton({ size = 'm' }: { size?: AvatarSize }) {
  return (
    <Stack spacing={1} sx={{ alignItems: 'center' }}>
      <Skeleton
        variant="circular"
        width={AVATAR_SIZES[size]}
        height={AVATAR_SIZES[size]}
      />

      <Typography sx={{ width: '50%', textAlign: 'center' }}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Typography>
    </Stack>
  );
}
