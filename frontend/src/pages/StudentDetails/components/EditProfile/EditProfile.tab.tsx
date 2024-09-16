import { FormEvent, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  editAccount,
  EditAccountOptions,
  EditAccountOptionsDTO,
} from '#modules/account/api/editAccount';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { EditProfileFormFields } from '../FormFields/EditProfileFormFields';

export function EditProfileTab() {
  const student = useCurrentUserData();

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState<EditAccountOptions>({
    firstName: student.name.split(' ')[0],
    lastName: student.name.split(' ')[1],
    username: student.username,
    description: student.description,
    faculty: student.faculty,
    path: student.path,
    promo: student.promo,
    picture: undefined,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const { error, mutate, isLoading } = useMutation<
    EditAccountOptionsDTO,
    ApiFormError<EditAccountOptionsDTO>,
    EditAccountOptions
  >(editAccount, {
    onSuccess: () => {
      queryClient.invalidateQueries(['student', 'current']);
      setHasChanges(false);
    },
  });

  function updateFormValues(val: Partial<EditAccountOptions>) {
    setHasChanges(true);
    setFormValues({ ...formValues, ...val });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  return (
    <>
      <form id="edit-account-form" onSubmit={(e) => onSubmit(e)}>
        <EditProfileFormFields
          formValues={formValues}
          previousValues={student}
          updateFormValues={updateFormValues}
          error={error}
        />
      </form>
      <LoadingButton
        variant="contained"
        loading={isLoading}
        type="submit"
        form="edit-account-form"
        disabled={!hasChanges}
      >
        {t('button.save')}
      </LoadingButton>
    </>
  );
}
