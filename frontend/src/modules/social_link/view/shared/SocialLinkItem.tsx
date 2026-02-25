import { Link } from 'react-router-dom';

import { Chip, useTheme } from '@mui/material';

import { SocialLink } from '#modules/social_link/types/socialLink.type';
import { getIconAndColor } from '#modules/social_link/utils/getIconAndColor';
import { getLabel } from '#modules/social_link/utils/getLabel';

interface SocialLinkItemProps {
  socialLink: Pick<SocialLink, 'uri' | 'label'>;
  clickable?: boolean;
}

export function SocialLinkItem({
  socialLink,
  clickable = true,
}: SocialLinkItemProps) {
  const label = getLabel(socialLink);
  const { icon, color } = getIconAndColor(socialLink, useTheme());

  const clickableProps = clickable
    ? {
        component: Link,
        to: socialLink.uri,
        target: '_blank',
        // empty function to make the chip clickable
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick: () => {},
      }
    : {};

  return (
    <Chip
      color="secondary"
      variant="outlined"
      sx={{
        border: 'none',
        fontWeight: 600,
        color: color,
        '&:active': {
          boxShadow: 'none',
        },
      }}
      icon={icon}
      label={label}
      {...clickableProps}
    />
  );
}
