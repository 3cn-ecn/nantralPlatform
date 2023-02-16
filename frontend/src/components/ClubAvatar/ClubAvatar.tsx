import { Button, Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton/IconButton';
import * as React from 'react';

function ClubAvatar(props: {
  name: string;
  logoUrl: string;
  clubUrl: string;
  size?: number;
}): JSX.Element {
  const { name, logoUrl, clubUrl, size } = props;
  return (
    <div
      style={{ alignItems: 'center', flexDirection: 'column', display: 'flex' }}
    >
      <IconButton href={clubUrl}>
        <Avatar alt="" src={logoUrl} sx={{ height: size, width: size }} />
      </IconButton>

      <p style={{ marginTop: 0 }}>{name}</p>
    </div>
  );
}

ClubAvatar.defaultProps = {
  size: 100,
};
export default ClubAvatar;
