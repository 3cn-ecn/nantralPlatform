import { Dispatch, useCallback } from 'react';

import { MenuItem } from '@mui/material';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { PostFormDTO } from '#modules/post/infra/post.dto';
import { Post, PostForm } from '#modules/post/post.types';
import { FormErrorAlert } from '#shared/components/FormErrorAlert/FormErrorAlert';
import {
  AutocompleteSearchField,
  CheckboxField,
  FileField,
  SelectField,
  TextField,
} from '#shared/components/FormFields';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { BaseLanguage } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface PostFormFieldsProps {
  isError: boolean;
  error: ApiFormError<PostFormDTO> | null;
  formValues: PostForm;
  updateFormValues: Dispatch<SetObjectStateAction<PostForm>>;
  prevData?: Partial<Post>;
  selectedLang: BaseLanguage;
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
      <FormErrorAlert isError={isError} error={error} />
      <TextField
        name="title"
        key={`title-${selectedLang}`}
        label={t('post.form.title.label')}
        value={formValues.titleTranslated[selectedLang]}
        handleChange={useCallback(
          (val) => {
            updateFormValues((prevState) => ({
              titleTranslated: {
                ...prevState.titleTranslated,
                [selectedLang]: val,
              },
            }));
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
        key={`description-${selectedLang}`}
        label={t('post.form.description.label')}
        value={formValues.descriptionTranslated[selectedLang]}
        handleChange={useCallback(
          (val) => {
            updateFormValues((prevState) => ({
              descriptionTranslated: {
                ...prevState.descriptionTranslated,
                [selectedLang]: val,
              },
            }));
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
      {prevData?.group?.canPin && (
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
