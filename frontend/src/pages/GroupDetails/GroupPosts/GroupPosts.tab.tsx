import { useState } from 'react';

import { Grid } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { CreatePostModal } from '#modules/post/view/CreatePostModal/CreatePostModal';
import { PostCard } from '#modules/post/view/PostCard/PostCard';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';

import { useInfiniteGroupPosts } from '../hooks/useInfiniteGroupPosts';
import { CreateButton } from '../shared/Buttons/CreateButton';

export function GroupPosts({ group }: { group: Group }) {
  const { data, ref } = useInfiniteGroupPosts({ groupSlug: group.slug });
  const [open, setOpen] = useState(false);
  return (
    <>
      <FlexRow justifyContent={'end'}>
        {group.isAdmin && <CreateButton onClick={() => setOpen(true)} />}
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
      {group.isAdmin && open && (
        <CreatePostModal
          onCreated={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
