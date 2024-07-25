import { Link } from 'react-router-dom';

import { Typography, useTheme } from '@mui/material';

import { GroupPreview } from '#modules/group/types/group.types';
import { Avatar, AvatarSize } from '#shared/components/Avatar/Avatar';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

interface GroupItemProps {
  size?: AvatarSize;
  group: GroupPreview;
}

function GroupItem({ group, size }: GroupItemProps) {
  const fallbackUrl = `https://api.dicebear.com/7.x/thumbs/svg?seed=${group.shortName}`;
  const theme = useTheme();

  return (
    <FlexCol alignItems={'center'} gap={1}>
      <Link to={group.url}>
        <Avatar
          sx={{
            '&:hover': {
              boxShadow: `0 0 10px ${theme.palette.text.primary}`,
              transition: 'box-shadow 0.1s ease',
            },
            objectFit: 'contain',
          }}
          size={size}
          src={group.icon || fallbackUrl}
          alt={group.name}
        />
      </Link>
      <Typography textAlign={'center'}>
        {group.shortName}
        {group.subCategory && (
          <Typography color="gray" variant="body1">
            {group.subCategory}
          </Typography>
        )}
      </Typography>
    </FlexCol>
  );
}

export default GroupItem;
