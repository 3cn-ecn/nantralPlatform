import { Link } from 'react-router-dom';

import * as Icons from '@mui/icons-material';
import { Button } from '@mui/material';

import { SocialLink } from '#modules/social_link/types/socialLink.type';

interface SocialLinkItemProps {
  socialLink: SocialLink;
}

export function SocialLinkItem({ socialLink }: SocialLinkItemProps) {
  const Icon = Icons?.[socialLink.network.iconName];
  return (
    <>
      <Link to={socialLink.uri} target="_blank">
        <Button
          startIcon={Icon && <Icon />}
          sx={{
            color: socialLink.network.color,
          }}
        >
          {socialLink.label || socialLink.network.name}
        </Button>
      </Link>
    </>
  );
}
