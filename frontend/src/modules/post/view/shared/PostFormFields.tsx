import { Dispatch, useCallback } from 'react';

import { Alert, AlertTitle, MenuItem } from '@mui/material';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import {
  AutocompleteSearchField,
  CheckboxField,
  FileField,
  SelectField,
  TextField,
} from '#shared/components/FormFields';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface PostFormFieldsProps {
  isError: boolean;
  error: ApiFormError<PostFormDTO> | null;
  formValues: PostForm;
  updateFormValues: Dispatch<Partial<PostForm>>;
  prevData?: Post;
  selectedLang: string;
}

export function PostFormFields({
  isError,
  error,
  formValues,
  updateFormValues,
  prevData,
  selectedLang,
}: PostFormFieldsProps) {
  const { t } = useTranslation();

  // Use callbacks for every functions passed to a prop of a memoized component,
  // such as all of our Field components. This allows to optimize performance
  // (when a field is modified, we only rerender this field and not all of them).
  const fetchInitialGroupOptions = useCallback(
    () =>
      getGroupListApi({ pageSize: 7, isAdmin: true }).then(
        (data) => data.results,
      ),
    [],
  );
  const fetchGroupOptions = useCallback(
    (searchText: string) =>
      getGroupListApi({ search: searchText, pageSize: 10 }).then(
        (data) => data.results,
      ),
    [],
  );

  const onPinnedChange = useCallback(
    (val: boolean) => updateFormValues({ pinned: val }),
    [updateFormValues],
  );

  return (
    <>
      {isError && (
        <Alert severity="error">
          <AlertTitle>{t('form.errors.title')}</AlertTitle>
          {!!error?.globalErrors?.length && (
            <ul>
              {error.globalErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </Alert>
      )}
      <TextField
        name="title"
        label={t('post.form.title.label')}
        value={formValues[`title_${selectedLang}`]}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ [`title_${selectedLang}`]: val });
          },
          [selectedLang, updateFormValues],
        )}
        errors={error?.fields?.title}
        required
      />
      <AutocompleteSearchField
        name="group"
        label={t('post.form.group.label')}
        helperText={t('post.form.group.helpText')}
        value={formValues.group}
        handleChange={useCallback(
          (val: number) => updateFormValues({ group: val }),
          [updateFormValues],
        )}
        defaultObjectValue={prevData?.group || null}
        errors={error?.fields?.group}
        required
        fetchInitialOptions={fetchInitialGroupOptions}
        fetchOptions={fetchGroupOptions}
        labelPropName="name"
        imagePropName="icon"
      />
      <RichTextField
        name="description"
        label={t('post.form.description.label')}
        key={selectedLang}
        value={formValues[`description_${selectedLang}`]}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ [`description_${selectedLang}`]: val });
          },
          [selectedLang, updateFormValues],
        )}
        errors={error?.fields?.description}
      />
      <FileField
        name="image"
        label={t('post.form.image.label')}
        helperText={t('post.form.image.helperText')}
        value={formValues.image}
        handleChange={useCallback(
          (val) => updateFormValues({ image: val }),
          [updateFormValues],
        )}
        prevFileName={prevData?.image}
        errors={error?.fields?.image}
        accept="image/*"
      />
      <SelectField
        name="publicity"
        label={t('post.form.publicity.label')}
        value={formValues.publicity}
        handleChange={useCallback(
          (val: 'Pub' | 'Mem') => updateFormValues({ publicity: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.publicity}
        defaultValue="Pub"
      >
        <MenuItem value="Pub">{t('post.form.publicity.options.pub')}</MenuItem>
        <MenuItem value="Mem">{t('post.form.publicity.options.mem')}</MenuItem>
      </SelectField>
      {prevData?.group.canPin && (
        <CheckboxField
          name="pinned"
          label={t('post.form.pinned.label')}
          value={formValues.pinned}
          handleChange={onPinnedChange}
        />
      )}
    </>
  );
}
