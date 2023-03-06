import { Box } from '@mui/material';
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
    <Box className="container">
      <Box
        sx={{
          borderWidth: 2,
          borderColor: 'red',
          border: '2px dashed red',
          padding: 2,
        }}
      >
        <h1 className="card-title">{t('404.error')}</h1>
        <p className="card-text">{t('404.notFound')}</p>
      </Box>
      <p>
        {t('404.whatYouCanDo')}
        <ul>
          <li>
            {t('404.bug')} <Link to="/">{t('404.report')}</Link>
          </li>
          <li>{t('404.home')}</li>
        </ul>
      </p>
      <Link to="/">
        <img
          alt=""
          src="/static/img/sheep.png"
          width={130}
          height={130}
          style={{ margin: 20 }}
        />
      </Link>
    </Box>
  );
}

export default NotFound;
