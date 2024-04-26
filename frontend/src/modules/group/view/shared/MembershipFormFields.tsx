import { Dispatch, useCallback } from 'react';

import { MembershipFormDTO } from '#modules/group/infra/membership.dto';
import { MembershipForm } from '#modules/group/types/membership.types';
import { getStudentListApi } from '#modules/student/api/getStudentList.api';
import { FlexAuto } from '#shared/components/FlexBox/FlexBox';
import {
  AutocompleteSearchField,
  CheckboxField,
  DateField,
  TextField,
} from '#shared/components/FormFields';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { ApiFormError } from '#shared/infra/errors';

interface JoinGroupFormFieldsProps {
  isError: boolean;
  error: ApiFormError<MembershipFormDTO> | null;
  formValues: MembershipForm;
  updateFormValues: Dispatch<SetObjectStateAction<MembershipForm>>;
  isAdmin?: boolean;
  selectStudent?: boolean;
}

export function MembershipFormFields({
  error,
  formValues,
  updateFormValues,
  isAdmin = false,
  selectStudent = false,
}: JoinGroupFormFieldsProps) {
  async function fetchOptions(search: string) {
    const data = await getStudentListApi({ search: search });
    return data.results;
  }
  return (
    <>
      {selectStudent && (
        <AutocompleteSearchField
          name="user"
          label={'User'}
          value={formValues.student}
          handleChange={(val) =>
            updateFormValues({ student: val || undefined })
          }
          defaultObjectValue={null}
          errors={error?.fields?.student}
          required
          // fetchInitialOptions={fetchInitialGroupOptions}
          fetchOptions={fetchOptions}
          labelPropName="name"
          imagePropName="picture"
        />
      )}
      <TextField
        label={'Résumé'}
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
        label={'Description'}
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
      <FlexAuto gap={2}>
        <DateField
          label={'Date de début'}
          value={formValues.beginDate}
          onChange={useCallback(
            (val) => {
              updateFormValues({ beginDate: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.begin_date}
          fullWidth
          required
        />
        <DateField
          label={'Date de fin'}
          disablePast
          value={formValues.endDate}
          onChange={useCallback(
            (val) => {
              updateFormValues({ endDate: val });
            },
            [updateFormValues],
          )}
          errors={error?.fields?.end_date}
          fullWidth
          required
        />
      </FlexAuto>

      {isAdmin && (
        <CheckboxField
          label="Admin"
          value={formValues.admin}
          handleChange={(val) => {
            updateFormValues({ admin: val });
          }}
        />
      )}
    </>
  );
}
