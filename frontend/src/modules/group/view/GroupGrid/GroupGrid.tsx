import { JSX } from 'react';

import { Grid } from '@mui/material';

import { GroupPreview } from '#modules/group/types/group.types';

import GroupItem from '../GroupItem/GroupItem';
import { GroupItemSkeleton } from '../GroupItemSkeleton/GroupItemSkeleton';

export function GroupGrid({
  groups,
  isPending = false,
  estimatedSize = 10,
  extraComponent,
}: {
  groups?: GroupPreview[];
  isPending?: boolean;
  estimatedSize?: number;
  extraComponent?: JSX.Element;
}) {
  return (
    <Grid spacing={1} container>
      {isPending
        ? Array(estimatedSize)
            .fill(0)
            .map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <GroupItemSkeleton size="xl" />
              </Grid>
            ))
        : groups?.map((group) => (
            <Grid key={group.slug} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
              <GroupItem size="xl" group={group} />
            </Grid>
          ))}
      {!isPending && extraComponent && (
        <Grid key={'extra'} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
          {extraComponent}
        </Grid>
      )}
    </Grid>
  );
}
