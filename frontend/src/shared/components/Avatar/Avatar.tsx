import React from 'react';

import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material';

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

interface AvatarProps {
  title: string;
  url?: string;
  icon?: JSX.Element;
  size?: 'small' | 'medium' | 'large';
  width?: number;
  height?: number;
  props: MuiAvatarProps;
}

/**
 * A component for abstract avatar with a picture or initials if no picture.
 *
 * @param props.title - The name of the avatar, used for the color
 * @param props.urls (optional) - The url of the picure
 * @param props.icon (optional) - An icon to show inside the avatar
 * @param props.size (optional) - The size of the avatar (small, medium, large)
 * @returns
 * @returns
 */
function Avatar(props: {
  title: string;
  url?: string;
  icon?: JSX.Element;
  size?: 'small' | 'medium' | 'large' | 'extra_large';
}) {
  const { title, url, icon, size } = props;
  const words = title.split(' ');
  const initials =
    words.length > 1
      ? `${words[0][0]}${words[1][0]}`
      : words[0].substring(0, 2);
  const sx = {};
  if (size === 'small')
    Object.assign(sx, { width: 30, height: 30, fontSize: 13 });
  if (size === 'large')
    Object.assign(sx, { width: 56, height: 56, fontSize: 24 });
  if (size === 'extra_large')
    Object.assign(sx, { width: 250, height: 250, fontSize: 150 });
  return (
    <MuiAvatar
      src={url}
      alt={title}
      sx={{ ...sx, bgcolor: stringToColor(title) }}
      {...props}
    >
      {icon || initials.toUpperCase()}
    </MuiAvatar>
  );
}

export default Avatar;