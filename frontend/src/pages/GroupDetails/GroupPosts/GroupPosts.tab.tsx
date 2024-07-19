import { useState } from 'react';

import { Grid, Typography } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { CreatePostModal } from '#modules/post/view/CreatePostModal/CreatePostModal';
import { PostCard } from '#modules/post/view/PostCard/PostCard';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CreateButton } from '../components/Buttons/CreateButton';
import { useInfiniteGroupPosts } from '../hooks/useInfiniteGroupPosts';

export function GroupPosts({ group }: { group: Group }) {
  const { data, ref } = useInfiniteGroupPosts({ groupSlug: group.slug });
  const [openModal, setOpenModal] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <FlexRow justifyContent={'end'}>
        {group.isAdmin && <CreateButton onClick={() => setOpenModal(true)} />}
      </FlexRow>
      <Grid spacing={1} container mt={2}>
        {data?.pages
          ?.flatMap((page) => page.results)
          .map((post) => (
            <Grid key={post.id} xs={12} md={6} lg={4} item>
              <PostCard post={post} />
            </Grid>
          ))}
        <div ref={ref} />
      </Grid>
      {data && data?.pages[0].count === 0 && (
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
