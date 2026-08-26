import { Trans } from 'react-i18next';

import {
  Lock as LockIcon,
  Public as PublicIcon,
  OpenInNew as LinkIcon,
} from '@mui/icons-material';
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  useTheme,
  alpha,
  Chip,
  Button,
  Tooltip,
  styled,
} from '@mui/material';

import { MatrixHomeLink } from '#shared/components/MatrixLink/MatrixLink';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

export function HomeHeader() {
  const theme = useTheme();
  const { t } = useTranslation();

  const mdBreakpoint = useBreakpoint('md');

  return (
    <Box
      sx={{
        position: 'relative',

        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0px',
          zIndex: 0,

          background: {
            // Mobile: red → green → blue vertically
            xs: `
              radial-gradient(
                ellipse 100% 100% at 50% 0%,
                ${alpha(theme.palette.primary.main, 0.55)} 0%,
                ${alpha(theme.palette.primary.main, 0.25)} 35%,
                transparent 75%
              ),

              radial-gradient(
                ellipse 100% 100% at 35% 72%,
                ${alpha(theme.palette.success.main, 0.4)} 0%,
                ${alpha(theme.palette.success.main, 0.18)} 35%,
                transparent 75%
              ),

              radial-gradient(
                ellipse 100% 100% at 70% 100%,
                ${alpha(theme.palette.info.main, 0.45)} 0%,
                ${alpha(theme.palette.info.main, 0.2)} 35%,
                transparent 75%
              ),

              ${theme.palette.background.default}
            `,

            // Desktop: red → green → blue horizontally
            md: `
              radial-gradient(
                ellipse 60% 200% at 0% 0%,
                ${alpha(theme.palette.primary.main, 0.55)} 0%,
                ${alpha(theme.palette.primary.main, 0.25)} 35%,
                transparent 75%
              ),

              radial-gradient(
                ellipse 60% 200% at 90% 100%,
                ${alpha(theme.palette.success.main, 0.4)} 0%,
                ${alpha(theme.palette.success.main, 0.18)} 35%,
                transparent 75%
              ),

              radial-gradient(
                ellipse 25% 200% at 95% 0%,
                ${alpha(theme.palette.info.main, 0.45)} 0%,
                ${alpha(theme.palette.info.main, 0.2)} 35%,
                transparent 75%
              ),

              ${theme.palette.background.default}
            `,
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, md: 6 },
          py: { xs: 7, md: 10 },
        }}
      >
        <Stack
          direction={mdBreakpoint.isSmaller ? 'column' : 'row'}
          justifyContent={'center'}
          alignItems={'center'}
          gap={10}
        >
          <Stack>
            <TitleTypography variant="h4">
              {t('home.welcomeTo')}
            </TitleTypography>
            <TitleTypography variant="poster">{t('site.name')}</TitleTypography>
          </Stack>
          <Card
            variant={'elevation'}
            elevation={5}
            sx={{
              backgroundColor: 'transparent',
              minWidth: { md: '400px' },
              maxWidth: 400,
            }}
          >
            <CardContent
              component={Stack}
              gap={2}
              height={'100%'}
              justifyContent={'center'}
              alignItems={'flex-start'}
            >
              <Typography variant="h2">
                <Trans
                  i18nKey={'home.element.title'}
                  components={{
                    name: (
                      <Box
                        component={'span'}
                        color={theme.palette.success.main}
                        sx={{ textWrap: 'nowrap' }}
                      />
                    ),
                  }}
                />
              </Typography>
              <Typography>{t('home.element.subtitle')}</Typography>
              <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
                <Tooltip title={t('home.element.selfHosted.tooltip')}>
                  <Chip
                    label={t('home.element.selfHosted.label')}
                    icon={<Box>🇫🇷</Box>}
                  />
                </Tooltip>
                <Tooltip title={t('home.element.secure.tooltip')}>
                  <Chip
                    label={t('home.element.secure.label')}
                    icon={<LockIcon />}
                  />
                </Tooltip>
                <Tooltip title={t('home.element.independent.tooltip')}>
                  <Chip
                    label={t('home.element.independent.label')}
                    icon={<PublicIcon />}
                  />
                </Tooltip>
              </Stack>
              <Button
                component={MatrixHomeLink}
                variant="contained"
                color={'success'}
                size={'large'}
                endIcon={<LinkIcon />}
                sx={{ mt: 2 }}
              >
                {t('home.element.goTo')}
              </Button>
              <Typography variant={'body2'}>
                <Trans
                  i18nKey={'home.element.helperText'}
                  components={{
                    code: (
                      <Box component={'code'} sx={{ textWrap: 'nowrap' }} />
                    ),
                  }}
                />
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: { xs: 140, md: 180 },
          zIndex: 2,
          pointerEvents: 'none',

          background: `linear-gradient(
        to bottom,
        transparent 0%,
        ${alpha(theme.palette.background.default, 0.15)} 35%,
        ${alpha(theme.palette.background.default, 0.8)} 75%,
        ${theme.palette.background.default} 100%
      )`,
        }}
      />
    </Box>
  );
}

const TitleTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: '2px 4px 15px rgba(0,0,0,0.3);',
}));
