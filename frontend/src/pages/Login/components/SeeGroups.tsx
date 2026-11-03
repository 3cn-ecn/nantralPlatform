import { Link } from 'react-router-dom';

import { Card, CardActionArea, Stack, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export function SeeGroupsButton() {
  const { t } = useTranslation();

  return (
    <Card variant="elevation">
      <CardActionArea component={Link} to="/group" sx={{ display: 'flex' }}>
        <Stack
          direction="row"
          spacing={3}
          sx={{ padding: 2, alignItems: 'center' }}
        >
          <img
            style={{
              width: 50,
              height: 50,
              border: 'solid',
              borderRadius: '50%',
              borderColor: 'gray',
              borderWidth: 2,
            }}
            src="/static/img/icons/cropped/club.svg"
            alt="Groups"
          />
          <Typography>{t('login.viewPublicGroups')}</Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
