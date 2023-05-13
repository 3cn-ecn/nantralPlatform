import React from 'react';
import { Link } from 'react-router-dom';

import { Alert, AlertTitle, Button } from '@mui/material';
import { Container } from '@mui/system';

import EditSuggestionModal from '#components/Suggestion/Suggestion';
import { useTranslation } from '#i18n/useTranslation';

/**
 * The 404 error page when the requested page is not found.
 *
 * @returns The NotFound component
 */
export default function NotFoundPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <Container sx={{ marginTop: 2 }}>
        <Alert severity="error" variant="filled">
          <AlertTitle>{t('404.error')}</AlertTitle>
          <p className="card-text">{t('404.notFound')}</p>
        </Alert>
        <div style={{ marginTop: 10 }}>
          {t('404.whatYouCanDo')}
          <ul>
            <li>
              {t('404.bug')}{' '}
              <Button
                variant="text"
                style={{ textTransform: 'lowercase' }}
                onClick={() => setOpen(true)}
              >
                {t('404.report')}
              </Button>
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
      <EditSuggestionModal
        open={open}
        closeModal={() => setOpen(false)}
        saveSuggestion={() => null}
      />
    </>
  );
}