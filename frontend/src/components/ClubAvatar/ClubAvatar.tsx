import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton/IconButton';
import * as React from 'react';
import { stringToColor } from '../../utils/formatText';

function ClubAvatar(props: {
  name: string;
  logoUrl: string;
  clubUrl: string;
  size?: number | string;
  textPosition?: 'right' | 'bottom' | false;
}): JSX.Element {
  const { name, logoUrl, clubUrl, size, textPosition } = props;
  const words = name.split(' ');
  const initials =
    words.length > 1
      ? `${words[0][0]}${words[1][0]}`
      : words[0].substring(0, 2);
  return (
    <div
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: textPosition === 'bottom' ? 'column' : 'row',
        display: 'flex',
        maxWidth: 'min-content',
      }}
    >
      <IconButton href={clubUrl} sx={{ padding: 0, margin: 1 }}>
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
      </IconButton>
      {textPosition && <p style={{ margin: 0 }}>{name}</p>}
    </div>
  );
}

ClubAvatar.defaultProps = {
  size: 100,
  textPosition: 'bottom',
};
export default ClubAvatar;
