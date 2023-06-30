import { FormEvent, useCallback, useState } from 'react';
import { useMutation } from 'react-query';

import { Button } from '@mui/material';

import { updatePost } from '#modules/post/api/updatePost';
import { Post, PostForm } from '#modules/post/post.types';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
} from '#shared/components/ResponsiveDialog';

type PostEditModalContentProps = {
  post: Post;
  onClose: () => void;
};

export function PostEditModalContent({
  post,
  onClose,
}: PostEditModalContentProps) {
  const postMutation = useMutation(updatePost);

  const [postValues, setPostValues] = useState<PostForm>({
    title: post.title,
    description: post.description,
    image: post.image,
    group: post.group.id,
    pinned: post.pinned,
    publicity: post.publicity,
  });

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>, values: PostForm) => {
      event.preventDefault();
      postMutation.mutate({ id: post.id, data: values });
    },
    [postMutation, post.id]
  );

  return (
    <form onSubmit={(e) => onSubmit(e, postValues)}>
      <ResponsiveDialogContent></ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          Annuler
        </Button>
        <LoadingButton
          loading={postMutation.isLoading}
          type="submit"
          variant="contained"
        >
          Valider
        </LoadingButton>
      </ResponsiveDialogFooter>
    </form>
  );
}
