import ReactPlayer from 'react-player';

import { Grid } from '@mui/material';

import { Group } from '#modules/group/types/group.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayerItem = (ReactPlayer as any).default ?? ReactPlayer;

export function GroupVideos({ group }: Readonly<{ group?: Group }>) {
  console.log(typeof group?.video1);
  console.log('ReactPlayer =', ReactPlayer);
  return (
    <Grid container spacing={1} mt={1}>
      {group?.video1 && (
        <Grid item xs={12} md={6} lg={6}>
          <ReactPlayerItem
            url={group?.video1}
            width={'100%'}
            height={'100%'}
            style={{ aspectRatio: 16 / 9 }}
            controls
          />
        </Grid>
      )}
      {group?.video2 && (
        <Grid item xs={12} md={6} lg={6}>
          <ReactPlayerItem
            url={group?.video2}
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
