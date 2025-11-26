import ReactPlayer from 'react-player';

import { Grid } from '@mui/material';

import { Group } from '#modules/group/types/group.types';

export function GroupVideos({ group }: { group?: Group }) {
  return (
    <Grid container spacing={1} mt={1}>
      {group?.video1 && (
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <ReactPlayer
            src={group?.video1}
            width={'100%'}
            height={'100%'}
            style={{ aspectRatio: 16 / 9 }}
            controls
          />
        </Grid>
      )}
      {group?.video2 && (
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <ReactPlayer
            src={group?.video2}
            width={'100%'}
            height={'100%'}
            style={{ aspectRatio: 16 / 9 }}
            controls
          />
        </Grid>
      )}
    </Grid>
  );
}
