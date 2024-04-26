import { Grid } from '@mui/material';

import { GroupPreview } from '#modules/group/types/group.types';

import GroupItem from '../GroupItem/GroupItem';
import { GroupItemSkeleton } from '../GroupItemSkeleton/GroupItemSkeleton';

export function GroupGrid({
  groups,
  isLoading = false,
  estimatedSize = 10,
}: {
  groups?: GroupPreview[];
  isLoading?: boolean;
  estimatedSize?: number;
  reloadDocument?: boolean;
}) {
  return (
    <Grid spacing={1} container>
      {isLoading
        ? Array(estimatedSize)
            .fill(0)
            .map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid key={index} xs={6} sm={4} md={3} lg={2} item>
                <GroupItemSkeleton size="xl" />
              </Grid>
            ))
        : groups?.map((group) => (
            <Grid key={group.slug} xs={6} sm={4} md={3} lg={2} item>
              <GroupItem size="xl" group={group} />
            </Grid>
          ))}
    </Grid>
  );
}
