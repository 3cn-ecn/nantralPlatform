import { Container, Typography, styled } from '@mui/material';

import { BackgroundImage } from '#shared/components/BackgroundImage/BackgroundImage';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function HomeHeader() {
  const { t } = useTranslation();

  return (
    <FlexCol alignItems="center" justifyContent="center" position="relative">
      <BackgroundImage
        src="/static/img/header.png"
        errorIcon={null}
        shift="top"
      />
      <Container sx={{ my: 8 }}>
        <TitleTypography variant="h4">{t('home.welcomeTo')}</TitleTypography>
        <TitleTypography variant="poster">{t('site.name')}</TitleTypography>
      </Container>
    </FlexCol>
  );
}

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  textShadow: '2px 4px 15px rgba(0,0,0,0.3);',
}));
