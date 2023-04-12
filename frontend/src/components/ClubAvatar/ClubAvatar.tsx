import { Skeleton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton/IconButton';
import * as React from 'react';
import { stringToColor } from '../../utils/formatText';

export function ClubAvatar(props: {
  name: string;
  logoUrl: string;
  clubUrl: string;
  size?: number | string;
  textPosition?: 'right' | 'bottom' | false;
  hideName?: boolean;
}): JSX.Element {
  const { name, logoUrl, clubUrl, size, textPosition, hideName } = props;
  const words = name.split(' ');
  const initials =
    words.length > 1
      ? `${words[0][0]}${words[1][0]}`
      : words[0].substring(0, 2);
  const nameArea = hideName
    ? null
    : textPosition && <p style={{ margin: 0 }}>{name}</p>;
  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: textPosition === 'bottom' ? 'column' : 'row',
        display: 'flex',
        maxWidth: 'max-content',
        textAlign: textPosition === 'bottom' ? 'center' : 'left',
      }}
    >
      <IconButton href={clubUrl} sx={{ padding: 0, margin: 1 }}>
        {/* <Link to={clubUrl} style={{ textDecorationLine: 'none' }}> */}
        <Avatar
          alt=""
          src={logoUrl}
          sx={{
            height: size,
            width: size,
            bgcolor: logoUrl ? 'transparent' : stringToColor(name),
            color: 'white',
          }}
        >
          {!logoUrl && initials}
        </Avatar>
        {/* </Link> */}
      </IconButton>
      {nameArea}
    </div>
  );
}

export function ClubAvatarSkeleton(props: {
  size?: number;
  textPosition?: 'right' | 'bottom' | false;
}) {
  const { size, textPosition } = props;
  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: textPosition === 'bottom' ? 'column' : 'row',
        display: 'flex',
      }}
    >
      <Skeleton variant="circular" sx={{ padding: 0, margin: 1 }}>
        <Avatar
          alt=""
          sx={{
            height: size,
            width: size,
          }}
        />
      </Skeleton>
      {textPosition && <Skeleton variant="text" sx={{ width: 60 }} />}
    </div>
  );
}

ClubAvatar.defaultProps = {
  size: 100,
  textPosition: 'bottom',
  hideName: false,
};

ClubAvatarSkeleton.defaultProps = {
  size: 100,
  textPosition: 'bottom',
};
