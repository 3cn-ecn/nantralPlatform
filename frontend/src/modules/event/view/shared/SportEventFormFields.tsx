import { Dispatch, useCallback } from 'react';

import { SportEventFormDTO } from '#modules/event/infra/sportevent.dto';
import { SportEvent, SportEventForm } from '#modules/event/sportevent.type';
import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { FlexAuto } from '#shared/components/FlexBox/FlexBox';
import { FormErrorAlert } from '#shared/components/FormErrorAlert/FormErrorAlert';
import {
  AutocompleteSearchField,
  DateTimeField,
  TextField,
} from '#shared/components/FormFields';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { BaseLanguage } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface SportEventFormFieldsProps {
  isError: boolean;
  error: ApiFormError<SportEventFormDTO> | null;
  formValues: SportEventForm;
  updateFormValues: Dispatch<SetObjectStateAction<SportEventForm>>;
  prevData?: Partial<SportEvent>;
  selectedLang: BaseLanguage;
}

export function SportEventFormFields({
  isError,
  error,
  formValues,
  updateFormValues,
  prevData,
  selectedLang,
}: Readonly<SportEventFormFieldsProps>) {
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

  return (
    <>
      <FormErrorAlert isError={isError} error={error} />
      <AutocompleteSearchField
        name="group"
        label={t('event.form.group.label')}
        helperText={t('event.form.group.helpText')}
        value={formValues.group}
        handleChange={useCallback(
          (val: number) => updateFormValues({ group: val }),
          [updateFormValues],
        )}
        defaultObjectValue={prevData?.group}
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
        label={t('event.form.description.label')}
        value={formValues.descriptionTranslated[selectedLang]}
        handleChange={useCallback(
          (val) => {
            updateFormValues((prevState: { descriptionTranslated: any }) => ({
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
      <FlexAuto columnGap={2} breakPoint="sm">
        <DateTimeField
          name="date"
          label={t('event.form.startDate.label')}
          value={formValues.date}
          onChange={useCallback(
            (val) => updateFormValues({ date: val }),
            [updateFormValues],
          )}
          errors={error?.fields?.date}
          required
          fullWidth
        />
      </FlexAuto>
      <TextField
        name="location"
        label={t('event.form.location.label')}
        value={formValues.location}
        handleChange={useCallback(
          (val) => updateFormValues({ location: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.location}
      />
    </>
  );
}
