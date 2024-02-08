import { Card, CardContent, Typography, Link, Box, List } from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';

export default function FeedbackPage() {
  return (
    <>
      <Spacer vertical={4} />
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
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
              <Link href="/feedback/suggestion">this form</Link>.
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
              Report it <Link href="/feedback/bug">here</Link> and we will take
              care of the rest 🔪 🤫.
            </Typography>
          </CardContent>
        </Card>
        <Spacer vertical={4} />
      </Box>
    </>
  );
}
