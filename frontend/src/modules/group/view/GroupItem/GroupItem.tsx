import { Link } from 'react-router-dom';

import { Typography } from '@mui/material';

import { GroupPreview } from '#modules/group/types/group.types';
import { Avatar, AvatarSize } from '#shared/components/Avatar/Avatar';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

interface GroupItemProps {
  size?: AvatarSize;
  group: GroupPreview;
}

function GroupItem({ group, size }: GroupItemProps) {
  const fallbackUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${group.shortName}`;
  return (
    <FlexCol alignItems={'center'} gap={1}>
      <Link to={group.url}>
        <Avatar size={size} src={group.icon || fallbackUrl} alt={group.name} />
      </Link>
      <Typography variant="h6" textAlign={'center'}>
        {group.shortName}
        {group.subCategory && (
          <Typography color="gray" variant="subtitle1">
            {group.subCategory}
          </Typography>
        )}
      </Typography>
    </FlexCol>
  );
}

export default GroupItem;
