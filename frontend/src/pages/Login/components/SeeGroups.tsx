import { Card, CardActionArea, Typography } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';

export function SeeGroupsButton() {
  return (
    <Card variant="elevation">
      <CardActionArea href={'/group/'} sx={{ display: 'flex' }}>
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
          <Typography>View Public Groups</Typography>
        </FlexRow>
      </CardActionArea>
    </Card>
  );
}
