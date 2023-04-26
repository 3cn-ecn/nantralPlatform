import React from 'react';
import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';

/**
 * Legal Notice, like the name and owner of the site, etc.
 * @returns Legal Notice page component
 */
export default function LegalPage() {
  const { t } = useTranslation('translation'); // translation module

  return (
    <Container>
      {/* <CheckboxListSecondary /> */}

      <h1>{t('legalNotice.title')}</h1>
      <h2>{t('legalNotice.subtitles.1')}</h2>
      <div>{t('legalNotice.paragraphs.1.lines.1')}</div>
      <div>{t('legalNotice.paragraphs.1.lines.2')}</div>
      <div>{t('legalNotice.paragraphs.1.lines.3')}</div>

      <h2>{t('legalNotice.subtitles.2')}</h2>
      <div>{t('legalNotice.paragraphs.2.lines.1')}</div>
      <div>{t('legalNotice.paragraphs.2.lines.2')}</div>
      <div>{t('legalNotice.paragraphs.2.lines.3')}</div>
      <div>{t('legalNotice.paragraphs.2.lines.4')}</div>
      <div>{t('legalNotice.paragraphs.2.lines.5')}</div>
      <div>{t('legalNotice.paragraphs.2.lines.6')}</div>

      <h2>{t('legalNotice.subtitles.3')}</h2>
      <p>{t('legalNotice.paragraphs.3')}</p>

      <h2>{t('legalNotice.subtitles.4')}</h2>
      <div>{t('legalNotice.paragraphs.4.lines.1')}</div>
      <div>{t('legalNotice.paragraphs.4.lines.2')}</div>
      <div>{t('legalNotice.paragraphs.4.lines.3')}</div>
      <div>{t('legalNotice.paragraphs.4.lines.4')}</div>
      <div>{t('legalNotice.paragraphs.4.lines.5')}</div>
      <div>{t('legalNotice.paragraphs.4.lines.6')}</div>

      <h2>{t('legalNotice.subtitles.5')}</h2>
      <p>{t('legalNotice.paragraphs.5.lines.1')}</p>
      <p>{t('legalNotice.paragraphs.5.lines.2')}</p>
      <p>{t('legalNotice.paragraphs.5.lines.3')}</p>
      <p>{t('legalNotice.paragraphs.5.lines.4')}</p>

      <h2>{t('legalNotice.subtitles.6')}</h2>
      <p>{t('legalNotice.paragraphs.6')}</p>

      <h2>{t('legalNotice.subtitles.7')}</h2>
      <p>{t('legalNotice.paragraphs.7')}</p>

      <h2>{t('legalNotice.subtitles.8')}</h2>
      <p>{t('legalNotice.paragraphs.8')}</p>
    </Container>
  );
}
