// cspell:ignore facebook, instagram, linkedin, youtube, spotify, discord, fortawesome, fontawesome, youtu
import {
  faDiscord,
  faFacebook,
  faInstagram,
  faLinkedin,
  faSpotify,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AlternateEmail as EmailIcon,
  Language as GlobeIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { colors, styled } from '@mui/material';

import { SocialLink } from '../types/socialLink.type';
import { getDomain } from './getDomain';

export function getIconAndColor(socialLink: SocialLink): {
  icon: JSX.Element;
  color: string;
} {
  const parsedUrl = new URL(socialLink.uri);

  if (parsedUrl.protocol == 'mailto:') {
    return { icon: <EmailIcon />, color: colors.deepOrange[600] };
  }
  if (parsedUrl.protocol == 'tel:') {
    return { icon: <PhoneIcon />, color: colors.green[600] };
  }

  const domain = getDomain(socialLink);

  switch (domain) {
    case 'facebook.com':
      return { icon: <FAIcon icon={faFacebook} />, color: colors.blue[600] };
    case 'instagram.com':
      return { icon: <FAIcon icon={faInstagram} />, color: colors.pink[600] };
    case 'x.com':
    case 'twitter.com':
      return { icon: <FAIcon icon={faXTwitter} />, color: colors.common.black };
    case 'linkedin.com':
      return { icon: <FAIcon icon={faLinkedin} />, color: colors.blue[600] };
    case 'youtube.com':
    case 'youtu.be':
      return { icon: <FAIcon icon={faYoutube} />, color: colors.red[600] };
    case 'spotify.com':
      return { icon: <FAIcon icon={faSpotify} />, color: colors.green[600] };
    case 'discord.gg':
      return { icon: <FAIcon icon={faDiscord} />, color: colors.indigo[400] };
    default:
      return { icon: <GlobeIcon />, color: colors.grey[600] };
  }
}

const FAIcon = styled(FontAwesomeIcon)({
  fontSize: '1.25rem',
  width: '1em',
  padding: '2px',
});
