import { ComponentProps } from 'react';

import { SvgIconComponent } from '@mui/icons-material';
import { AvatarTypeMap, Avatar as MuiAvatar, useTheme } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { stringToColor } from '#shared/utils/stringToColor';

// the type is more complex than usual because we want to keep the 'component'
// props of the MuiAvatar
type AvatarComponentType<
  P = object,
  D extends React.ElementType = 'div',
> = OverridableComponent<
  AvatarTypeMap<
    P & {
      alt: string;
      Icon?: SvgIconComponent;
      size?: AvatarSize;
    },
    D
  >
>;
export type AvatarSize = 's' | 'm' | 'l' | 'xl' | 'xxl';

export const AVATAR_SIZES = {
  s: 28,
  m: 40,
  l: 48,
  xl: 115,
  xxl: 170,
};

/**
 * A custom Avatar extending the default MUI Avatar with:
 * - initials extracted from the alt text
 * - the background color generated from the hash of the alt.
 */
export const Avatar: AvatarComponentType = ({
  alt,
  Icon,
  size = 'm',
  sx,
  ...props
}: ComponentProps<AvatarComponentType>) => {
  const theme = useTheme();

  const altWords = alt ? alt.split(' ') : '  ';
  const initials = (
    altWords.length > 1
      ? `${altWords[0][0]}${altWords[1][0]}`
      : altWords[0].substring(0, 2)
  ).toLocaleUpperCase();

  const bgColor = stringToColor(alt);

  return (
    <MuiAvatar
      alt={alt}
      sx={{
        width: AVATAR_SIZES[size],
        height: AVATAR_SIZES[size],
        fontSize: AVATAR_SIZES[size] * 0.4,
        backgroundColor: props.src ? 'transparent' : bgColor,
        color: theme.palette.getContrastText(bgColor),
        textDecoration: 'none',
        img: { objectFit: 'contain' },
        ...sx,
      }}
      {...props}
    >
      {Icon ? <Icon sx={{ bgcolor: bgColor }} /> : initials}
    </MuiAvatar>
  );
};
