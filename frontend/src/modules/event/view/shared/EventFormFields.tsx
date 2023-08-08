import { Dispatch, useCallback } from 'react';

import { LocalFireDepartment } from '@mui/icons-material';
import { Alert, AlertTitle, MenuItem, Paper, Typography } from '@mui/material';

import { Event, EventForm } from '#modules/event/event.type';
import { EventFormDTO } from '#modules/event/infra/event.dto';
import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { FlexAuto, FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  AutocompleteSearchField,
  DateTimeField,
  FileField,
  SelectField,
  TextField,
} from '#shared/components/FormFields';
import { NumberField } from '#shared/components/FormFields/NumberField';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

type EventFormFieldsProps = {
  isError: boolean;
  error: ApiFormError<EventFormDTO> | null;
  formValues: EventForm;
  updateFormValues: Dispatch<Partial<EventForm>>;
  prevData?: Event;
};

export function EventFormFields({
  isError,
  error,
  formValues,
  updateFormValues,
  prevData,
}: EventFormFieldsProps) {
  const { t } = useTranslation();

  // Use callbacks for every functions passed to a prop of a memoized component,
  // such as all of our Field components. This allows to optimize performance
  // (when a field is modified, we only rerender this field and not all of them).
  const fetchInitialGroupOptions = useCallback(
    () =>
      getGroupListApi({ pageSize: 7, isAdmin: true }).then(
        (data) => data.results
      ),
    []
  );
  const fetchGroupOptions = useCallback(
    (searchText: string) =>
      getGroupListApi({ search: searchText, pageSize: 10 }).then(
        (data) => data.results
      ),
    []
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
        label={t('event.form.title.label')}
        value={formValues.title}
        handleChange={useCallback(
          (val) => updateFormValues({ title: val }),
          [updateFormValues]
        )}
        errors={error?.fields?.title}
        required
      />
      <AutocompleteSearchField
        name="group"
        label={t('event.form.group.label')}
        helperText={t('event.form.group.helpText')}
        value={formValues.group}
        handleChange={useCallback(
          (val: number) => updateFormValues({ group: val }),
          [updateFormValues]
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
        label={t('event.form.description.label')}
        value={formValues.description}
        handleChange={useCallback(
          (val) => updateFormValues({ description: val }),
          [updateFormValues]
        )}
        errors={error?.fields?.description}
      />
      <FlexAuto columnGap={2} breakPoint="sm">
        <DateTimeField
          name="start_date"
          label={t('event.form.startDate.label')}
          value={formValues.startDate}
          onChange={useCallback(
            (val) => updateFormValues({ startDate: val }),
            [updateFormValues]
          )}
          errors={error?.fields?.start_date}
          required
          fullWidth
        />
        <DateTimeField
          name="end_date"
          label={t('event.form.endDate.label')}
          value={formValues.endDate}
          minDateTime={formValues.startDate || undefined}
          onChange={useCallback(
            (val) => updateFormValues({ endDate: val }),
            [updateFormValues]
          )}
          errors={error?.fields?.end_date}
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
          [updateFormValues]
        )}
        errors={error?.fields?.location}
      />
      <FileField
        name="image"
        label={t('event.form.image.label')}
        helperText={t('event.form.image.helperText')}
        value={formValues.image}
        handleChange={useCallback(
          (val) => updateFormValues({ image: val }),
          [updateFormValues]
        )}
        prevFileName={prevData?.image}
        errors={error?.fields?.image}
        accept="image/*"
      />
      <TextField
        name="form_url"
        label={t('event.form.formUrl.label')}
        helperText={t('event.form.formUrl.helperText')}
        value={formValues.formUrl}
        handleChange={useCallback(
          (val) => updateFormValues({ formUrl: val }),
          [updateFormValues]
        )}
        errors={error?.fields?.form_url}
        type="url"
        placeholder="https://example.com"
      />
      <Paper sx={{ p: 2, my: 1 }} variant="outlined">
        <FlexRow alignItems="center" gap={1} mb={1}>
          <LocalFireDepartment />
          <Typography variant="h5">
            {t('event.form.shotgunSection.title')}
          </Typography>
        </FlexRow>
        <Typography mb={1}>{t('event.form.shotgunSection.helper')}</Typography>
        <FlexAuto columnGap={2} breakPoint="sm">
          <DateTimeField
            name="start_registration"
            label={t('event.form.startRegistration.label')}
            value={formValues.startRegistration}
            onChange={useCallback(
              (val) => updateFormValues({ startRegistration: val }),
              [updateFormValues]
            )}
            errors={error?.fields?.start_registration}
            fullWidth
          />
          <DateTimeField
            name="end_registration"
            label={t('event.form.endRegistration.label')}
            value={formValues.endRegistration}
            onChange={useCallback(
              (val) => updateFormValues({ endRegistration: val }),
              [updateFormValues]
            )}
            errors={error?.fields?.end_registration}
            fullWidth
          />
        </FlexAuto>
        <NumberField
          name="max_participant"
          label={t('event.form.maxParticipant.label')}
          helperText={
            formValues.formUrl
              ? t('event.form.maxParticipant.disabledHelperText')
              : undefined
          }
          value={formValues.maxParticipant}
          handleChange={useCallback(
            (val) => updateFormValues({ maxParticipant: val }),
            [updateFormValues]
          )}
          errors={error?.fields?.max_participant}
          disabled={!!formValues.formUrl}
        />
      </Paper>
      <SelectField
        name="publicity"
        label={t('event.form.publicity.label')}
        helperText={t('event.form.publicity.helperText')}
        value={formValues.publicity}
        handleChange={useCallback(
          (val: 'Pub' | 'Mem') => updateFormValues({ publicity: val }),
          [updateFormValues]
        )}
        errors={error?.fields?.publicity}
        defaultValue="Pub"
      >
        <MenuItem value="Pub">{t('event.form.publicity.options.pub')}</MenuItem>
        <MenuItem value="Mem">{t('event.form.publicity.options.mem')}</MenuItem>
      </SelectField>
    </>
  );
}
