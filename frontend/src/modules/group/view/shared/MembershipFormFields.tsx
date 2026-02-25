import { useCallback } from 'react';

import { Verified } from '@mui/icons-material';

import { getUserListApi } from '#modules/account/api/getUserList.api';
import { MembershipFormDTO } from '#modules/group/infra/membership.dto';
import { MembershipForm } from '#modules/group/types/membership.types';
import { FlexAuto, FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  AutocompleteSearchField,
  CheckboxField,
  DateField,
  TextField,
} from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface JoinGroupFormFieldsProps {
  isError: boolean;
  error: ApiFormError<MembershipFormDTO> | null;
  formValues: MembershipForm;
  updateFormValues: (val: Partial<MembershipForm>) => void;
  isAdmin?: boolean;
  selectUser?: boolean;
  showDates?: boolean;
}

export function MembershipFormFields({
  error,
  formValues,
  updateFormValues,
  isAdmin = false,
  selectUser = false,
  showDates = true,
}: JoinGroupFormFieldsProps) {
  async function fetchOptions(search: string) {
    const data = await getUserListApi({ search: search });
    return data.results;
  }
  const { t } = useTranslation();
  return (
    <>
      {selectUser && (
        <AutocompleteSearchField
          name="user"
          label={t('group.details.form.user.label')}
          value={formValues.user}
          handleChange={(val) => updateFormValues({ user: val || undefined })}
          defaultObjectValue={null}
          errors={error?.fields?.user}
          required
          fetchOptions={fetchOptions}
          labelPropName="name"
          imagePropName="picture"
        />
      )}
      <TextField
        label={t('group.details.form.summary.label')}
        value={formValues.summary}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ summary: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.summary}
      />
      <TextField
        label={t('group.details.form.description.label')}
        value={formValues.description}
        handleChange={useCallback(
          (val) => {
            updateFormValues({ description: val });
          },
          [updateFormValues],
        )}
        errors={error?.fields?.description}
        multiline
      />
      {showDates && (
        <FlexAuto gap={2}>
          <DateField
            label={t('group.form.beginDate.label')}
            value={formValues.beginDate}
            onChange={(val) => {
              updateFormValues({ beginDate: val ?? undefined });
            }}
            errors={error?.fields?.begin_date}
            fullWidth
            required
          />
          <DateField
            label={t('group.form.endDate.label')}
            minDate={formValues.beginDate}
            value={formValues.endDate}
            onChange={(val) => {
              updateFormValues({ endDate: val ?? undefined });
            }}
            errors={error?.fields?.end_date}
            fullWidth
            required
          />
        </FlexAuto>
      )}

      {isAdmin && (
        <FlexRow alignItems="center">
          <CheckboxField
            label={t('group.form.admin.label')}
            value={formValues.admin}
            handleChange={(val) => {
              updateFormValues({ admin: val });
            }}
            sx={{ mr: 1 }}
          />
          <Verified color="secondary" />
        </FlexRow>
      )}
    </>
  );
}
