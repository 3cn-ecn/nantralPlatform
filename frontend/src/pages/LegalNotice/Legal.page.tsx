import { Typography } from '@mui/material';
import Container from '@mui/material/Container';

import { PageTemplate } from '#shared/components/PageTemplate/PageTemplate';
import { useTranslation } from '#shared/i18n/useTranslation';

/**
 * Legal Notice, like the name and owner of the site, etc.
 * @returns Legal Notice page component
 */
export default function LegalNoticePage() {
  const { t } = useTranslation(); // translation module

  return (
    <PageTemplate>
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Typography variant="h1">{t('legalNotice.title')}</Typography>
        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.1')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.1.lines.1')}</Typography>
        <Typography>{t('legalNotice.paragraphs.1.lines.2')}</Typography>
        <Typography>{t('legalNotice.paragraphs.1.lines.3')}</Typography>

        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.2')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.2.lines.1')}</Typography>
        <Typography>{t('legalNotice.paragraphs.2.lines.2')}</Typography>
        <Typography>{t('legalNotice.paragraphs.2.lines.3')}</Typography>
        <Typography>{t('legalNotice.paragraphs.2.lines.4')}</Typography>
        <Typography>{t('legalNotice.paragraphs.2.lines.5')}</Typography>
        <Typography>{t('legalNotice.paragraphs.2.lines.6')}</Typography>

        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.3')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.3')}</Typography>

        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.4')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.4.lines.1')}</Typography>
        <Typography>{t('legalNotice.paragraphs.4.lines.2')}</Typography>
        <Typography>{t('legalNotice.paragraphs.4.lines.3')}</Typography>
        <Typography>{t('legalNotice.paragraphs.4.lines.4')}</Typography>
        <Typography>{t('legalNotice.paragraphs.4.lines.5')}</Typography>
        <Typography>{t('legalNotice.paragraphs.4.lines.6')}</Typography>

        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.5')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.5.lines.1')}</Typography>
        <Typography>{t('legalNotice.paragraphs.5.lines.2')}</Typography>
        <Typography>{t('legalNotice.paragraphs.5.lines.3')}</Typography>
        <Typography>{t('legalNotice.paragraphs.5.lines.4')}</Typography>

        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.6')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.6')}</Typography>

        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.7')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.7')}</Typography>

        <Typography variant="h4" mt={3} mb={2}>
          {t('legalNotice.subtitles.8')}
        </Typography>
        <Typography>{t('legalNotice.paragraphs.8')}</Typography>
      </Container>
    </PageTemplate>
  );
}
