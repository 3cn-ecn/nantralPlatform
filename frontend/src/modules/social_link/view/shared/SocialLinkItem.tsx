import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { AlternateEmail as AtIcon, Tag as TagIcon } from '@mui/icons-material';
import { Chip, colors, useTheme } from '@mui/material';

import { SocialLink } from '#modules/social_link/types/socialLink.type';
import { getIconAndColor } from '#modules/social_link/utils/getIconAndColor';
import { getLabel } from '#modules/social_link/utils/getLabel';
import { MatrixLink } from '#shared/components/MatrixLink/MatrixLink';

interface SocialLinkItemProps {
  socialLink: Pick<SocialLink, 'uri' | 'label'>;
  clickable?: boolean;
}

const isMatrixUri = (uri: string) =>
  uri.startsWith('@') || uri.startsWith('#') || uri.startsWith('!');

export function SocialLinkItem({
  socialLink,
  clickable = true,
}: SocialLinkItemProps) {
  const theme = useTheme();

  const { label, icon, color, Component } = useMemo(() => {
    if (isMatrixUri(socialLink.uri)) {
      const matrixLabel =
        socialLink.label || socialLink.uri.split(':')[0].slice(1);
      const matrixIcon = socialLink.uri.startsWith('@') ? (
        <AtIcon />
      ) : (
        <TagIcon />
      );
      return {
        label: matrixLabel,
        icon: matrixIcon,
        color: colors.lightGreen[800],
        Component: MatrixLink,
      };
    }

    const resolvedLabel = getLabel(socialLink);
    const { icon: resolvedIcon, color: resolvedColor } = getIconAndColor(
      socialLink,
      theme,
    );
    return {
      label: resolvedLabel,
      icon: resolvedIcon,
      color: resolvedColor,
      Component: Link,
    };
  }, [socialLink, theme]);

  const clickableProps = clickable
    ? {
        component: Component,
        to: socialLink.uri,
        target: '_blank',
        clickable: true,
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
