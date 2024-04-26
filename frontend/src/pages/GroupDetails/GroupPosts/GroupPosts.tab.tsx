import { Grid } from '@mui/material';

import { PostCard } from '#modules/post/view/PostCard/PostCard';

import { useInfiniteGroupPosts } from '../hooks/useInfiniteGroupPosts';

export function GroupPosts({ groupSlug }: { groupSlug: string }) {
  const { data, ref } = useInfiniteGroupPosts({ groupSlug: groupSlug });

  return (
    <>
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
    </>
  );
}
