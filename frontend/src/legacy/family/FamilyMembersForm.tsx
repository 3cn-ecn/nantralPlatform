import { useState } from 'react';

import { getUserListApi } from '#modules/account/api/getUserList.api';
import { User } from '#modules/account/user.types';
import { FormErrorAlert } from '#shared/components/FormErrorAlert/FormErrorAlert';
import { AutocompleteSearchField } from '#shared/components/FormFields';

import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';

declare const CURRENT_MEMBERS: User[];
declare const ERRORS: {
  student0?: string[];
  student1?: string[];
  student2?: string[];
  student3?: string[];
  student4?: string[];
  student5?: string[];
  student6?: string[];
  student7?: string[];
  non_field_errors?: string[];
};

function FamilyMembersForm() {
  const defaultFormValues: (number | null)[] = [
    ...CURRENT_MEMBERS.map((member) => member.id),
  ];

  for (let i = 0; i < 8 - CURRENT_MEMBERS.length; i++) {
    defaultFormValues.push(null);
  }

  const [formValues, setFormValues] =
    useState<(number | null)[]>(defaultFormValues);

  function updateFormValues(i: number, val: number | null) {
    formValues[i] = val;
    setFormValues([...formValues]);
  }

  async function fetchOptions(search: string) {
    const data = await getUserListApi({ search: search });
    return data.results;
  }
  console.log(formValues);
  return (
    <>
      <FormErrorAlert
        isError={!!ERRORS?.non_field_errors}
        error={{ globalErrors: ERRORS?.non_field_errors } as never}
      />
      {Array(8)
        .fill(0)
        .map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            <AutocompleteSearchField
              name={`memberships-${i}`}
              label={'Membre'}
              value={formValues[i]}
              handleChange={(val) => updateFormValues(i, val)}
              initialObjectValue={CURRENT_MEMBERS[i]}
              fetchOptions={fetchOptions}
              labelPropName="name"
              imagePropName="picture"
              errors={ERRORS?.[`student${i}`]}
            />
            <input
              hidden
              name={`student${i}`}
              value={formValues[i] ?? ''}
              readOnly
            />
          </div>
        ))}
    </>
  );
}

wrapAndRenderLegacyCode(<FamilyMembersForm />, 'membership-form');
