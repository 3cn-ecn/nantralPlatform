import { FormEvent, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { Button } from '@mui/material';

import { UpdatePostVariables, updatePost } from '#modules/post/api/updatePost';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import { TextFieldInput } from '#shared/components/FormFields/TextFieldInput';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
} from '#shared/components/ResponsiveDialog';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';
import { useObjectState } from '#shared/utils/useObjectState';

type PostEditModalContentProps = {
  post: Post;
  onClose: () => void;
};

export function PostEditModalContent({
  post,
  onClose,
}: PostEditModalContentProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // the values currently in our form
  const [formValues, updateFormValues] = useObjectState<PostForm>({
    title: post.title,
    description: post.description,
    image: post.image,
    group: post.group.id,
    pinned: post.pinned,
    publicity: post.publicity,
  });

  // create all states for error, loading, etc. while fetching the API
  const { mutate, error, isError, isLoading } = useMutation<
    void,
    ApiError<PostFormDTO>,
    UpdatePostVariables
  >(updatePost);

  // send the form to the server
  // useCallback allows to not recreate the function on every rerender
  const onSubmit = useCallback(
    (event: FormEvent, values: PostForm) => {
      // prevent the default function of <form>
      event.preventDefault();
      // call the updatePost function
      mutate(
        { id: post.id, data: values },
        {
          onSuccess: () => {
            // if success, reset the post data in all queries
            queryClient.invalidateQueries('posts');
            queryClient.invalidateQueries(['post', { id: post.id }]);
            // close the modal
            onClose();
          },
        }
      );
    },
    [post.id, mutate, queryClient, onClose]
  );

  return (
    <form onSubmit={(e) => onSubmit(e, formValues)}>
      <ResponsiveDialogContent>
        <TextFieldInput
          name="title"
          label={t('post.form.title.label')}
          value={formValues.title}
          onValueChange={(val) => updateFormValues({ title: val })}
          isError={isError}
          errorMessage={error?.title}
          required
        />
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          Annuler
        </Button>
        <LoadingButton loading={isLoading} type="submit" variant="contained">
          Valider
        </LoadingButton>
      </ResponsiveDialogFooter>
    </form>
  );
}
