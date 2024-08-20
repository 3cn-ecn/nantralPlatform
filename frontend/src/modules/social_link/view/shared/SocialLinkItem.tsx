import { Link } from 'react-router-dom';

import { Button } from '@mui/material';

import { SocialLink } from '#modules/social_link/types/socialLink.type';

interface SocialLinkItemProps {
  socialLink: SocialLink;
}

export function SocialLinkItem({ socialLink }: SocialLinkItemProps) {
  return (
    <>
      <Link to={socialLink.uri} target="_blank">
        <Button
          startIcon={<i className={socialLink.network.iconName} />}
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
