import { FormEvent, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { Alert, AlertTitle, Button, MenuItem } from '@mui/material';

import { getGroupList } from '#modules/group/api/getGroupList';
import { UpdatePostVariables, updatePost } from '#modules/post/api/updatePost';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import { AutocompleteSearchField } from '#shared/components/FormFields/AutocompleteSearchField';
import { CheckboxField } from '#shared/components/FormFields/CheckboxField';
import { CustomTextField } from '#shared/components/FormFields/CustomTextField';
import { FileField } from '#shared/components/FormFields/FileField';
import { SelectField } from '#shared/components/FormFields/SelectField';
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
    image: null,
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
          onChange={useCallback(
            (val) => updateFormValues({ title: val }),
            [updateFormValues]
          )}
          errors={error?.title}
          required
        />
        <AutocompleteSearchField
          name="group"
          label={t('post.form.group.label')}
          helperText={t('post.form.group.helpText')}
          value={formValues.group}
          onChange={useCallback(
            (val) => updateFormValues({ group: val }),
            [updateFormValues]
          )}
          defaultObjectValue={post.group}
          errors={error?.group}
          required
          fetchInitialOptions={useCallback(
            () => getGroupList({ pageSize: 7 }).then((data) => data.results),
            []
          )}
          fetchOptions={useCallback(
            (searchText) =>
              getGroupList({ search: searchText, pageSize: 10 }).then(
                (data) => data.results
              ),
            []
          )}
          getOptionLabel={(group) => group.name}
          getOptionImage={(group) => group.icon}
        />
        <CustomTextField
          name="description"
          label={t('post.form.description.label')}
          value={formValues.description}
          onChange={useCallback(
            (val) => updateFormValues({ description: val }),
            [updateFormValues]
          )}
          errors={error?.description}
          multiline
          minRows={3}
        />
        <FileField
          name="image"
          label={t('post.form.image.label')}
          helperText={t('post.form.image.helperText')}
          value={formValues.image}
          onChange={useCallback(
            (val) => updateFormValues({ image: val }),
            [updateFormValues]
          )}
          prevFileName={post.image}
          errors={error?.image}
          accept="image/*"
        />
        <SelectField
          name="publicity"
          label={t('post.form.publicity.label')}
          value={formValues.publicity}
          onChange={useCallback(
            (val: 'Pub' | 'Mem') => updateFormValues({ publicity: val }),
            [updateFormValues]
          )}
          errors={error?.publicity}
          defaultValue="Pub"
        >
          <MenuItem value="Pub">
            {t('post.form.publicity.options.pub')}
          </MenuItem>
          <MenuItem value="Mem">
            {t('post.form.publicity.options.mem')}
          </MenuItem>
        </SelectField>
        <CheckboxField
          name="pinned"
          label={t('post.form.pinned.label')}
          value={formValues.pinned}
          onChange={useCallback(
            (val) => updateFormValues({ pinned: val }),
            [updateFormValues]
          )}
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
