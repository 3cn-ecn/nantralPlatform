// cspell:ignore facebook, instagram, linkedin, youtube, spotify, discord, fortawesome, fontawesome, youtu
import {
  faDiscord,
  faFacebook,
  faFacebookMessenger,
  faInstagram,
  faLinkedin,
  faSpotify,
  faWhatsapp,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AlternateEmail as AtIcon,
  EmailOutlined as EmailIcon,
  Language as GlobeIcon,
  Phone as PhoneIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { colors, styled, Theme } from '@mui/material';

import { SocialLink } from '../types/socialLink.type';
import { getDomain } from './getDomain';

export function getIconAndColor(
  socialLink: Pick<SocialLink, 'uri' | 'label'>,
  theme: Theme,
): { icon: JSX.Element; color: string } {
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
      return {
        icon: <FAIcon icon={faXTwitter} />,
        color: theme.palette.text.primary,
      };
    case 'linkedin.com':
      return { icon: <FAIcon icon={faLinkedin} />, color: colors.blue[600] };
    case 'youtube.com':
    case 'youtu.be':
      return { icon: <FAIcon icon={faYoutube} />, color: colors.red[600] };
    case 'spotify.com':
      return { icon: <FAIcon icon={faSpotify} />, color: colors.green[600] };
    case 'discord.gg':
      return { icon: <FAIcon icon={faDiscord} />, color: colors.indigo[400] };
    case 'm.me':
      return {
        icon: <FAIcon icon={faFacebookMessenger} />,
        color: colors.blue[400],
      };
    case 'whatsapp.com':
      return { icon: <FAIcon icon={faWhatsapp} />, color: colors.green[600] };
    case 'matrix.to':
      return {
        icon: parsedUrl.hash.startsWith('#/@') ? <AtIcon /> : <TagIcon />,
        color: colors.lightGreen[800],
      };
    default:
      return { icon: <GlobeIcon />, color: colors.grey[600] };
  }
}

const FAIcon = styled(FontAwesomeIcon)({
  fontSize: '1.25rem',
  width: '1em',
  padding: '2px',
});
