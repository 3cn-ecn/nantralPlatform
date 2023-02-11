import React from 'react';
import { Avatar as MUIAvatar } from '@mui/material';

function stringToColor(string) {
  let hash = 0;
  /* eslint-disable no-bitwise */
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return color;
}

function Avatar(props: {url: string; title: string, size: 'small' | 'medium' | 'large'}) {
  const { url, title, size } = props;
  const initials = `${title.split(' ')[0][0]}${title.split(' ')[1][0]}`;
  const sx = size === 'small' ?
    { width: 24, height: 24, fontSize: 12 }
  : size === 'large' ?
    { width: 56, height: 56, fontSize: 24 }
  : {};
  return <MUIAvatar 
    src={url}
    alt={title}
    children={initials}
    sx={{...sx, bgcolor: stringToColor(title)}}
  />
}

export default Avatar;
