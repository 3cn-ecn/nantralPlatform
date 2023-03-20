import { Alert, AlertTitle } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
/**
 * The 404 error page when the requested page is not found.
 *
 * @returns The NotFound component
 */
function NotFound() {
  const { t } = useTranslation('translation');
  return (
    <Container sx={{ marginTop: 2 }}>
      <Alert severity="error">
        <AlertTitle>{t('404.error')}</AlertTitle>
        <p className="card-text">{t('404.notFound')}</p>
      </Alert>
      <div style={{ marginTop: 10 }}>
        {t('404.whatYouCanDo')}
        <ul>
          <li>
            {t('404.bug')} <Link to="/">{t('404.report')}</Link>
          </li>
          <li>{t('404.home')}</li>
        </ul>
      </div>
      <Link to="/">
        <img
          alt=""
          src="/static/img/sheep.png"
          width={130}
          height={130}
          style={{ margin: 20 }}
        />
      </Link>
    </Container>
  );
}

export default NotFound;
