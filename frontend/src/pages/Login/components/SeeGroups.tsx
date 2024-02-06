import { Card, CardActionArea, Icon, Typography } from '@mui/material';

export function SeeGroupsButton() {
  return (
    <Card variant="elevation">
      <CardActionArea
        href={'/group/'}
        sx={{ padding: 2, display: 'flex', gap: 3 }}
      >
        <Icon
          component="img"
          sx={{
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
      </CardActionArea>
    </Card>
  );
}
