import { FormEvent, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { Alert, AlertTitle, Button } from '@mui/material';

import { getGroupList } from '#modules/group/api/getGroupList';
import { UpdatePostVariables, updatePost } from '#modules/post/api/updatePost';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import { AutocompleteSearchField } from '#shared/components/FormFields/AutocompleteSearchField';
import { CustomTextField } from '#shared/components/FormFields/CustomTextField';
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
  const { mutate, isLoading, isError, error } = useMutation<
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
        {isError && (
          <Alert severity="error">
            <AlertTitle>{t('form.errors.title')}</AlertTitle>
            {!!error.globalErrors?.length && (
              <ul>
                {error.globalErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </Alert>
        )}
        <CustomTextField
          name="title"
          label={t('post.form.title.label')}
          value={formValues.title}
          onChange={(val) => updateFormValues({ title: val })}
          errors={error?.title}
          required
        />
        <AutocompleteSearchField
          name="group"
          label={t('post.form.group.label')}
          helperText={t('post.form.group.helpText')}
          value={formValues.group}
          onChange={(val) => updateFormValues({ group: val })}
          defaultObjectValue={post.group}
          errors={error?.group}
          required
          fetchInitialOptions={() =>
            getGroupList({ pageSize: 7 }).then((data) => data.results)
          }
          fetchOptions={(searchText) =>
            getGroupList({ search: searchText, pageSize: 10 }).then(
              (data) => data.results
            )
          }
          getOptionLabel={(group) => group.name}
          getOptionImage={(group) => group.icon}
        />
        <CustomTextField
          name="description"
          label={t('post.form.description.label')}
          value={formValues.description}
          onChange={(val) => updateFormValues({ description: val })}
          errors={error?.description}
          multiline
          minRows={3}
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
