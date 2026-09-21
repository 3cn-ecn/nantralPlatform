import { FormEvent, useState } from 'react';

import { Edit as EditIcon } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GroupPreview } from '#modules/group/types/group.types';
import { createPostApi } from '#modules/post/api/createPost.api';
import { usePostFormValues } from '#modules/post/hooks/usePostFormValues';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import { LanguageSelector } from '#shared/components/LanguageSelector/LanguageSelector';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { PostFormFields } from '../shared/PostFormFields';

interface CreatePostModalProps {
  onClose: () => void;
  onCreated: (postId: number) => void;
  group?: GroupPreview & { canPin: boolean };
}

export function CreatePostModal({
  onClose,
  onCreated,
  group,
}: CreatePostModalProps) {
  const { currentBaseLanguage, t } = useTranslation();
  const queryClient = useQueryClient();
  const { palette } = useTheme();

  const [selectedLang, setSelectedLang] = useState(currentBaseLanguage);
  const [formValues, updateFormValues] = usePostFormValues({
    group: group?.id,
  });

  // create all states for error, loading, etc. while fetching the API
  const { mutate, isPending, isError, error } = useMutation<
    Post,
    ApiFormError<PostFormDTO>,
    PostForm
  >({ mutationFn: createPostApi });

  // send the form to the server
  const onSubmit = (event: FormEvent, values: PostForm) => {
    // prevent the default function of <form>
    event.preventDefault();
    // call the updatePost function
    mutate(values, {
      onSuccess: (data) => {
        // if success, reset the post data in all queries
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
        queryClient.invalidateQueries({
          queryKey: ['notifications'],
        });
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
        <Spacer flex={1} />
        <LanguageSelector
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
        />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="create-post-form" onSubmit={(e) => onSubmit(e, formValues)}>
          <PostFormFields
            isError={isError}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
            selectedLang={selectedLang}
            prevData={{ group: group }}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          Annuler
        </Button>
        <LoadingButton
          form="create-post-form"
          type="submit"
          loading={isPending}
          variant="contained"
        >
          Valider
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
