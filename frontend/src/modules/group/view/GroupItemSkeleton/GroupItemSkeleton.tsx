import { Skeleton, Typography } from '@mui/material';

import { AVATAR_SIZES, AvatarSize } from '#shared/components/Avatar/Avatar';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function GroupItemSkeleton({ size = 'm' }: { size?: AvatarSize }) {
  return (
    <FlexCol alignItems={'center'} gap={1}>
      <Skeleton
        variant="circular"
        width={AVATAR_SIZES[size]}
        height={AVATAR_SIZES[size]}
      />

      <Typography sx={{ width: '50%' }} textAlign={'center'}>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Typography>
    </FlexCol>
  );
}
