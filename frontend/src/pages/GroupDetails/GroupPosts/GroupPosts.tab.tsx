import { useState } from 'react';

import { Grid, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { CreatePostModal } from '#modules/post/view/CreatePostModal/CreatePostModal';
import { PostCard } from '#modules/post/view/PostCard/PostCard';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CreateButton } from '../components/Buttons/CreateButton';
import { useInfiniteGroupPosts } from '../hooks/useInfiniteGroupPosts';

export function GroupPosts({ group }: { group: Group }) {
  const postsQuery = useInfiniteGroupPosts({ groupSlug: group.slug });
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <FlexRow justifyContent={'end'}>
        {group.isAdmin && <CreateButton onClick={() => setOpenModal(true)} />}
      </FlexRow>
      <InfiniteList query={postsQuery}>
        <Grid spacing={1} container mt={2}>
          {postsQuery.data?.pages
            ?.flatMap((page) => page.results)
            .map((post) => (
              <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <PostCard post={post} />
              </Grid>
            ))}
        </Grid>
      </InfiniteList>
      {postsQuery.data && postsQuery.data?.pages[0].count === 0 && (
        <Typography color="secondary" mt={3} textAlign="center">
          {t('post.noPosts')}
        </Typography>
      )}
      {group.isAdmin && openModal && (
        <CreatePostModal
          onCreated={() => setOpenModal(false)}
          onClose={() => setOpenModal(false)}
          group={{ ...group, canPin: false }}
        />
      )}
    </>
  );
}
