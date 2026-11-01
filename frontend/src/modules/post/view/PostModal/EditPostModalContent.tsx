import { FormEvent, useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updatePostApi,
  UpdatePostApiVariables,
} from '#modules/post/api/updatePost.api';
import { usePostFormValues } from '#modules/post/hooks/usePostFormValues';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import { LanguageSelector } from '#shared/components/LanguageSelector/LanguageSelector';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { PostFormFields } from '../shared/PostFormFields';

interface EditPostModalContentProps {
  post: Post;
  onClose: () => void;
  onFinish: () => void;
}

export function EditPostModalContent({
  post,
  onClose,
  onFinish,
}: EditPostModalContentProps) {
  const { t, currentBaseLanguage } = useTranslation();
  const queryClient = useQueryClient();
  const { palette } = useTheme();

  const [selectedLang, setSelectedLang] = useState(currentBaseLanguage);
  const [formValues, updateFormValues] = usePostFormValues({ post: post });

  // create all states for error, loading, etc. while fetching the API
  const { mutate, isPending, isError, error } = useMutation<
    unknown,
    ApiFormError<PostFormDTO>,
    UpdatePostApiVariables
  >({ mutationFn: updatePostApi });

  // send the form to the server
  const onSubmit = (event: FormEvent, values: PostForm) => {
    // prevent the default function of <form>
    event.preventDefault();
    // call the updatePost function
    mutate(
      { id: post.id, data: values },
      {
        onSuccess: () => {
          // if success, reset the post data in all queries
          queryClient.invalidateQueries({
            queryKey: ['posts'],
          });
          queryClient.invalidateQueries({
            queryKey: ['post', { id: post.id }],
          });
          queryClient.invalidateQueries({
            queryKey: ['notifications'],
          });
          // close the modal
          onFinish();
        },
      },
    );
  };

  return (
    <>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <EditIcon />
          </Avatar>
        }
      >
        {t('post.editModal.title')}
        <Spacer flex={1} />
        <LanguageSelector
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
        />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="edit-post-form" onSubmit={(e) => onSubmit(e, formValues)}>
          <PostFormFields
            isError={isError}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
            prevData={post}
            selectedLang={selectedLang}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onFinish()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="edit-post-form"
          type="submit"
          loading={isPending}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </>
  );
}
