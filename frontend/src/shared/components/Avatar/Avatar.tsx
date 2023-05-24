import React from 'react';

import { Avatar as MuiAvatar } from '@mui/material';

import { stringToColor } from '#shared/utils/stringToColor';

type AvatarProps = {
  title: string;
  size?: 's' | 'm' | 'l' | 'xxl';
  url?: string;
  icon?: JSX.Element;
};

export function Avatar({ title, url, icon, size = 'm' }: AvatarProps) {
  const titleWords = title.split(' ');
  const initials = (
    titleWords.length > 1
      ? `${titleWords[0][0]}${titleWords[1][0]}`
      : titleWords[0].substring(0, 2)
  ).toLocaleUpperCase();

  const sizes = {
    s: 28,
    m: 40,
    l: 56,
    xxl: 250,
  };

  return (
    <MuiAvatar
      src={url}
      alt={title}
      sx={{
        width: sizes[size],
        height: sizes[size],
        fontSize: sizes[size] * 0.4,
        bgcolor: stringToColor(title),
      }}
    >
      {icon || initials}
    </MuiAvatar>
  );
}
