import { FormEvent } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPostApi } from '#modules/post/api/createPost.api';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useObjectState } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { PostFormFields } from '../shared/PostFormFields';

type CreatePostModalProps = {
  onClose: () => void;
  onCreated: (postId: number) => void;
};

export function CreatePostModal({ onClose, onCreated }: CreatePostModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { palette } = useTheme();

  // the values currently in our form
  const [formValues, updateFormValues] = useObjectState<PostForm>({
    title: '',
    description: '',
    image: undefined,
    group: null,
    pinned: false,
    publicity: 'Pub',
  });

  // create all states for error, loading, etc. while fetching the API
  const { mutate, isLoading, isError, error } = useMutation<
    Post,
    ApiFormError<PostFormDTO>,
    PostForm
  >(createPostApi);

  // send the form to the server
  const onSubmit = (event: FormEvent, values: PostForm) => {
    // prevent the default function of <form>
    event.preventDefault();
    // call the updatePost function
    mutate(values, {
      onSuccess: (data) => {
        // if success, reset the post data in all queries
        queryClient.invalidateQueries('posts');
        queryClient.invalidateQueries('notifications');
        // close the modal
        onCreated(data.id);
      },
    });
  };

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <EditIcon />
          </Avatar>
        }
      >
        {t('post.createModal.title')}
      </ResponsiveDialogHeader>
      <form onSubmit={(e) => onSubmit(e, formValues)}>
        <ResponsiveDialogContent>
          <PostFormFields
            isError={isError}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
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
    </ResponsiveDialog>
  );
}
