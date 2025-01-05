import { Container, Typography, styled } from '@mui/material';
import { darken } from '@mui/material/styles';

import { BackgroundImageOverlay } from '#pages/EventDetails/components/BackgroundImageOverlay';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function HomeHeader() {
  const { t } = useTranslation();

  return (
    <>
      <BackgroundImageOverlay src="/static/img/header.png" />
      <FlexCol alignItems="center" justifyContent="center" position="relative">
        <Container>
          <FlexCol
            sx={{
              my: 6,
            }}
          >
            <TitleTypography variant="h4" sx={{ textShadow: '' }}>
              {t('home.welcomeTo')}
            </TitleTypography>

            <TitleTypography className="shine" variant="poster">
              {t('site.name')}
            </TitleTypography>
            <Typography className="shine" textAlign={'center'} my={2}>
              {t('login.website.ecn')}
            </Typography>
          </FlexCol>
        </Container>
      </FlexCol>
    </>
  );
}

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textAlign: 'center',
  textShadow: `0 1px 0 ${theme.palette.primary.light}, 
               0 2px 0 ${darken(theme.palette.primary.dark, 0.05)},
               0 3px 0 ${darken(theme.palette.primary.dark, 0.1)},
               0 4px 0 ${darken(theme.palette.primary.dark, 0.15)},
               0 5px 0 ${darken(theme.palette.primary.dark, 0.2)},
               0 6px 1px rgba(0,0,0,.1),
               0 0 5px rgba(0,0,0,.1),
               0 1px 3px rgba(0,0,0,.25),
               0 3px 5px rgba(0,0,0,.2),
               0 5px 10px rgba(0,0,0,.23),
               0 10px 10px rgba(0,0,0,.2),
               0 20px 20px rgba(0,0,0,.15);`,
  fontFamily: 'Anton',
  transition: '100ms',
  WebkitUserSelect: 'none' /* Safari */,
  msUserSelect: 'none' /* IE 10 and IE 11 */,
  userSelect: 'none' /* Standard syntax */,
}));

const links = [
  { label: 'Onboard', url: 'https://onboard.ec-nantes.fr' },
  { label: 'Webmail', url: 'https://webmail.ec-nantes.fr/' },
  { label: 'Hippocampus', url: 'https://hippocampus.ec-nantes.fr/' },
  { label: 'Intranet', url: 'https://etudiant.ec-nantes.fr' },
];
