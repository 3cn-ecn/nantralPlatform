import { Link as RouterLink } from 'react-router-dom';

import {
  Card,
  CardContent,
  Typography,
  Container,
  List,
  Link,
} from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';

export default function FeedbackHomePage() {
  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h1" gutterBottom>
        Feedback
      </Typography>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h4">
            🙋 Need help ?
          </Typography>
          <List sx={{ listStyleType: 'disc', pl: 4, py: 0 }}>
            <Typography
              sx={{ display: 'list-item' }}
              variant="body2"
              color="text.secondary"
            >
              Write us on{' '}
              <Link href="https://m.me/nantralplatform.ecn">Messenger</Link>
            </Typography>
            <Typography
              sx={{ display: 'list-item' }}
              variant="body2"
              color="text.secondary"
            >
              Email us on{' '}
              <Link href="mailto:contact@nantral-platform.fr">
                contact@nantral-platform.fr
              </Link>
            </Typography>
          </List>
        </CardContent>
      </Card>
      <Spacer vertical={2} />
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h4">
            ✨ Have a suggestion ?
          </Typography>
          <Typography sx={{ pl: 1 }} variant="body2" color="text.secondary">
            Tell us about it by filling{' '}
            <RouterLink to="/feedback/suggestion">this form</RouterLink>.
          </Typography>
        </CardContent>
      </Card>
      <Spacer vertical={2} />
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h4">
            🐛 Noticed a bug ?
          </Typography>
          <Typography sx={{ pl: 1 }} variant="body2" color="text.secondary">
            Report it <RouterLink to="/feedback/bug">here</RouterLink> and we
            will take care of the rest 🔪 🤫.
          </Typography>
        </CardContent>
      </Card>
      <Spacer vertical={4} />
    </Container>
  );
}
