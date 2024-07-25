import { Paper, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { useGroupChildren } from '../hooks/useGroupChildren';
import { GroupVideos } from './GroupVideos';

interface GroupHomeProps {
  group?: Group;
}

export function GroupHome({ group }: GroupHomeProps) {
  const childrenQuery = useGroupChildren({
    slug: group?.slug || '',
  });

  return (
    <>
      <GroupVideos group={group} />
      <RichTextRenderer content={group?.description || ''} />
      <Spacer vertical={2} />
      {childrenQuery.data?.pages && childrenQuery.data?.pages[0].count > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h2" mb={2}>
            Sous-Groupes
          </Typography>
          <InfiniteList query={childrenQuery}>
            <GroupGrid
              groups={childrenQuery.data?.pages.flatMap((page) => page.results)}
            />
            {childrenQuery.isFetchingNextPage && (
              <GroupGrid isLoading estimatedSize={50} />
            )}
          </InfiniteList>
        </Paper>
      )}
    </>
  );
}
