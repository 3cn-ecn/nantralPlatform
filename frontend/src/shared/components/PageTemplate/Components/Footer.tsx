import { Container, Typography, styled, Link } from '@mui/material';

import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <FlexCol alignItems="center" justifyContent="center" position="relative">
      <Container sx={{ my: 2 }}>
        <FooterTypography variant="body1">
          <Link href="/legal-notice">{t('userMenu.menu.legalNotice')}</Link> |{' '}
          <Link href="/feedback">{t('userMenu.menu.feedback')}</Link> |{' '}
          <Link href="https://docs.nantral-platform.fr/">
            {t('userMenu.menu.documentation')}
          </Link>
        </FooterTypography>
      </Container>
    </FlexCol>
  );
}

const FooterTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  textShadow: '2px 4px 15px rgba(0,0,0,0.3);',
}));
