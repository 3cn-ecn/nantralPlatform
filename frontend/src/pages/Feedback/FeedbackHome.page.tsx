import { useNavigate } from 'react-router-dom';

import { Card, CardContent, Typography, Container, Link } from '@mui/material';

import { LargeBigButton } from '#shared/components/LargeBigButton/LargeBigButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function FeedbackHomePage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h1" gutterBottom>
        {t('feedback.home.title')}
      </Typography>
      <Spacer vertical={2} />
      <ContactForHelpCard />
      <Spacer vertical={2} />
      <SuggestionCard />
      <Spacer vertical={2} />
      <BugCard />
    </Container>
  );
}

function ContactForHelpCard() {
  const { t } = useTranslation();

  return (
    <Card sx={{ pt: 1 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {t('feedback.home.help.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t('feedback.home.help.description')}
        </Typography>
        <ul style={{ margin: 0 }}>
          <li>
            <Link
              href="https://m.me/nantralplatform.ecn"
              variant="body2"
              target="_blank"
              rel="noopener"
            >
              {t('feedback.home.help.messenger')}
            </Link>
          </li>
          <li>
            <Link
              href="mailto:contact@nantral-platform.fr"
              variant="body2"
              target="_blank"
              rel="noopener"
            >
              contact@nantral-platform.fr
            </Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

function SuggestionCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <LargeBigButton
      onClick={() => navigate('/feedback/suggestion')}
      sx={{ py: 1 }}
    >
      <Typography gutterBottom variant="h4">
        {t('feedback.home.suggestion.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('feedback.home.suggestion.description')}
      </Typography>
    </LargeBigButton>
  );
}

function BugCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <LargeBigButton onClick={() => navigate('/feedback/bug')} sx={{ py: 1 }}>
      <Typography gutterBottom variant="h4">
        {t('feedback.home.bug.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('feedback.home.bug.description')}
      </Typography>
    </LargeBigButton>
  );
}
