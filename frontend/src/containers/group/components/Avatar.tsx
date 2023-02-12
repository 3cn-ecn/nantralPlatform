import React from 'react';
import { Avatar as MUIAvatar } from '@mui/material';

/**
 * Create a color from a string.
 *
 * @param string The string to create the color from
 * @returns A color as a hexadecimal string
 */
function stringToColor(string: string): string {
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

/**
 * A component for abstract avatar with a picture or initials if no picture.
 *
 * @param props.urls - The url of the picure
 * @param props.title - The name of the avatar, used for the color generation
 * @param props.size - The size of the avatar (small, medium, large)
 * @returns 
 */
function Avatar(props: {url?: string; title: string, size?: 'small' | 'medium' | 'large', children?: JSX.Element}) {
  const { url, title, size, children } = props;
  const initials = `${title.split(' ')[0][0]}${title.split(' ')[1][0]}`;
  const sx = size === 'small' ?
    { width: 30, height: 30, fontSize: 13 }
  : size === 'large' ?
    { width: 56, height: 56, fontSize: 24 }
  : {};
  return <MUIAvatar 
    src={url}
    alt={title}
    children={children ? children : initials}
    sx={{...sx, bgcolor: stringToColor(title)}}
  />
}

export default Avatar;
