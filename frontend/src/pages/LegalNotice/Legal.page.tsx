import { Typography, Link, List, ListItem } from '@mui/material';
import Container from '@mui/material/Container';

import { useTranslation } from '#shared/i18n/useTranslation';

import { Address, ParagraphBody, ParagraphTitle } from './Components';

/**
 * Legal Notice, like the name and owner of the site, etc.
 * @returns Legal Notice page component
 */
export default function LegalNoticePage() {
  const { t } = useTranslation(); // translation module

  return (
    <Container sx={{ my: 6 }}>
      <Typography variant="h1">{t('legalNotice.title')}</Typography>

      <ParagraphTitle>
        {t('legalNotice.paragraphs.publisher.title')}
      </ParagraphTitle>
      <ParagraphBody>
        {t('legalNotice.paragraphs.publisher.text')}
      </ParagraphBody>
      <ParagraphBody>
        {t('legalNotice.paragraphs.publisher.address_title')}
        <Address>
          {t('legalNotice.paragraphs.publisher.address_line_1')} <br />
          {t('legalNotice.paragraphs.publisher.address_line_2')} <br />
          {t('legalNotice.paragraphs.publisher.address_line_3')} <br />
          {t('legalNotice.paragraphs.publisher.address_line_4')} <br />
        </Address>
        {t('legalNotice.paragraphs.publisher.people_text')}
        <List dense>
          <ListItem sx={{ py: 0.2 }}>
            | {t('legalNotice.paragraphs.publisher.aecn_president')} -{' '}
            {t('legalNotice.paragraphs.publisher.aecn_president_title')} ;
          </ListItem>
          <ListItem sx={{ py: 0.2 }}>
            | {t('legalNotice.paragraphs.publisher.aecn_dsi')} -{' '}
            {t('legalNotice.paragraphs.publisher.aecn_dsi_title')} ;
          </ListItem>
          <ListItem sx={{ py: 0.2 }}>
            | {t('legalNotice.paragraphs.publisher.3cn_president')} -{' '}
            {t('legalNotice.paragraphs.publisher.3cn_president_title')}.
          </ListItem>
        </List>
      </ParagraphBody>

      <ParagraphTitle>
        {t('legalNotice.paragraphs.host_provider.title')}
      </ParagraphTitle>
      <ParagraphBody>
        {t('legalNotice.paragraphs.host_provider.text')}
        <Address>
          {t('legalNotice.paragraphs.host_provider.address_line_1')} <br />
          {t('legalNotice.paragraphs.host_provider.address_line_2')} <br />
          {t('legalNotice.paragraphs.host_provider.address_line_3')} <br />
        </Address>
      </ParagraphBody>
      <ParagraphTitle>
        {t('legalNotice.paragraphs.copyright.title')}
      </ParagraphTitle>
      <ParagraphBody>
        {t('legalNotice.paragraphs.copyright.text1')}
        {t('legalNotice.paragraphs.copyright.text2')}
      </ParagraphBody>
      <ParagraphTitle>{t('legalNotice.paragraphs.rgpd.title')}</ParagraphTitle>
      <ParagraphBody>{t('legalNotice.paragraphs.rgpd.text')}</ParagraphBody>
      <ParagraphBody>
        {t('legalNotice.paragraphs.rgpd.contact_text')}
        <Link href={`mailto:${t('legalNotice.paragraphs.rgpd.contact_email')}`}>
          {t('legalNotice.paragraphs.rgpd.contact_email')}
        </Link>
        {t('legalNotice.paragraphs.rgpd.contact_post_email')}
      </ParagraphBody>
    </Container>
  );
}
