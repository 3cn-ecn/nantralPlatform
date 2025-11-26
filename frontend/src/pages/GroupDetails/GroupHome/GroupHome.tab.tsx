import { useNavigate } from 'react-router-dom';

import { Card, CardActionArea, Paper, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { useGroupChildren } from '../hooks/useGroupChildren';
import { GroupVideos } from './GroupVideos';

interface GroupHomeProps {
  group?: Group;
}

export function GroupHome({ group }: GroupHomeProps) {
  const childrenQuery = useGroupChildren({
    slug: group?.slug || '',
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <GroupVideos group={group} />
      <RichTextRenderer content={group?.description || ''} />
      <Spacer vertical={2} />
      {group?.parent && (
        <Card
          sx={{ maxWidth: 220 }}
          onClick={() => navigate(group.parent?.url || '')}
        >
          <CardActionArea sx={{ p: 2 }}>
            <FlexRow alignItems={'center'} justifyContent={'center'} gap={2}>
              <Typography>{t('group.details.subGroupOf')}</Typography>
              <Avatar alt={group.parent.shortName} src={group.parent?.icon} />
            </FlexRow>
          </CardActionArea>
        </Card>
      )}
      {childrenQuery.data?.pages && childrenQuery.data?.pages[0].count > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h2" mb={2}>
            {t('group.details.subgroups')}
          </Typography>
          <InfiniteList query={childrenQuery}>
            <GroupGrid
              groups={childrenQuery.data?.pages.flatMap((page) => page.results)}
            />
            {childrenQuery.isFetchingNextPage && (
              <GroupGrid isPending estimatedSize={50} />
            )}
          </InfiniteList>
        </Paper>
      )}
    </>
  );
}
