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
      size?: 's' | 'm' | 'l' | 'xl' | 'xxl';
    },
    D
  >
>;

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

  const sizes = {
    s: 28,
    m: 40,
    l: 48,
    xl: 115,
    xxl: 170,
  };

  const bgColor = stringToColor(alt);

  return (
    <MuiAvatar
      alt={alt}
      sx={{
        width: sizes[size],
        height: sizes[size],
        fontSize: sizes[size] * 0.4,
        backgroundColor: bgColor,
        color: theme.palette.getContrastText(bgColor),
        textDecoration: 'none',
        ...sx,
      }}
      {...props}
    >
      {Icon ? <Icon /> : initials}
    </MuiAvatar>
  );
};
