import { Link } from 'react-router-dom';

import { Chip } from '@mui/material';

import { SocialLink } from '#modules/social_link/types/socialLink.type';
import { getIconAndColor } from '#modules/social_link/utils/getIconAndColor';
import { getLabel } from '#modules/social_link/utils/getLabel';

interface SocialLinkItemProps {
  socialLink: SocialLink;
}

export function SocialLinkItem({ socialLink }: SocialLinkItemProps) {
  const label = getLabel(socialLink);
  const { icon, color } = getIconAndColor(socialLink);

  return (
    <Chip
      color="secondary"
      variant="outlined"
      style={{
        border: 'none',
        fontWeight: 600,
        color: color,
      }}
      icon={icon}
      label={label}
      component={Link}
      to={socialLink.uri}
      target="_blank"
      // empty function to make the chip clickable
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={() => {}}
    />
  );
}
