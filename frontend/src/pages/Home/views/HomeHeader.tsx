import React from 'react';

import { Typography, styled, useTheme } from '@mui/material';

import { BackgroundImage } from '#shared/components/BackgroundImage/BackgroundImage';
import { useTranslation } from '#shared/i18n/useTranslation';

export function HomeHeader() {
  const { t } = useTranslation();
  const theme = useTheme();
  const headerHeight = theme.spacing(30);

  return (
    <HeaderContainer sx={{ minHeight: headerHeight }}>
      <BackgroundImage
        src="/static/img/header.png"
        errorIcon={null}
        duration={500}
        height={headerHeight}
      />
      <Title variant="h5">{t('home.welcomeTo')}</Title>
      <Title variant="h1">{t('site.name')}</Title>
    </HeaderContainer>
  );
}

const HeaderContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  textShadow: '2px 4px 15px rgba(0,0,0,0.3);',
}));
