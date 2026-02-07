import { Dispatch, useCallback } from 'react';

import { Verified } from '@mui/icons-material';

import { MembershipFormDTO } from '#modules/group/infra/membership.dto';
import { MembershipForm } from '#modules/group/types/membership.types';
import { getStudentListApi } from '#modules/student/api/getStudentList.api';
import { FlexAuto, FlexRow } from '#shared/components/FlexBox/FlexBox';
import {
  AutocompleteSearchField,
  CheckboxField,
  DateField,
  TextField,
} from '#shared/components/FormFields';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface JoinGroupFormFieldsProps {
  isError: boolean;
  error: ApiFormError<MembershipFormDTO> | null;
  formValues: MembershipForm;
  updateFormValues: Dispatch<SetObjectStateAction<MembershipForm>>;
  isAdmin?: boolean;
  selectStudent?: boolean;
  showDates?: boolean;
}

export function MembershipFormFields({
  error,
  formValues,
  updateFormValues,
  isAdmin = false,
  selectStudent = false,
  showDates = true,
}: JoinGroupFormFieldsProps) {
  async function fetchOptions(search: string) {
    const data = await getStudentListApi({ search: search });
    return data.results;
  }
  const { t } = useTranslation();
  return (
    <>
      {selectStudent && (
        <AutocompleteSearchField
          name="user"
          label={t('group.details.form.user.label')}
          value={formValues.student}
          handleChange={(val) =>
            updateFormValues({ student: val || undefined })
          }
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
