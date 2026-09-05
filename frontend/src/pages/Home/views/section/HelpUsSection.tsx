import { Link as RouterLink } from 'react-router';

import { Link } from '@mui/material';

import { Section } from '#shared/components/Section/Section';
import { useTranslation } from '#shared/i18n/useTranslation';

export function HelpUsSection() {
  const { t } = useTranslation();

  return (
    <Section title={t('home.helpUsSection.title')}>
      <ul>
        <li>
          {t('home.helpUsSection.level', { level: '1 ⭐️' })}
          <Link
            href={
              'https://play.google.com/store/apps/details?id=org.ecn_3cn.nantral_platform'
            }
          >
            {t('home.helpUsSection.android')}
          </Link>
        </li>
        <li>
          {t('home.helpUsSection.level', { level: '2 🥰' })}
          <Link href={'https://github.com/3cn-ecn/nantralPlatform'}>
            {t('home.helpUsSection.github')}
          </Link>
        </li>
        <li>
          {t('home.helpUsSection.level', { level: '3 😍' })}
          <Link component={RouterLink} to="/feedback/">
            {t('home.helpUsSection.giveFeedback')}
          </Link>
        </li>
        <li>
          {t('home.helpUsSection.level', { level: '4 🤩' })}
          <Link href="https://docs.nantral-platform.fr/">
            {t('home.helpUsSection.contribute')}
          </Link>
        </li>
      </ul>
    </Section>
  );
}
