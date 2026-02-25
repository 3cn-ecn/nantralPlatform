import { Link } from 'react-router-dom';

import { Card, CardActionArea, Typography } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function SeeGroupsButton() {
  const { t } = useTranslation();

  return (
    <Card variant="elevation">
      <CardActionArea
        component={Link}
        to="/group/?type=club"
        sx={{ display: 'flex' }}
      >
        <FlexRow sx={{ padding: 2, gap: 3, alignItems: 'center' }}>
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
        </FlexRow>
      </CardActionArea>
    </Card>
  );
}
