import { FormEvent, useState } from 'react';

import { Divider } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  editAccount,
  EditAccountOptions,
  EditAccountOptionsDTO,
} from '#modules/account/api/editAccount';
import { Student } from '#modules/student/student.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { EditProfileFormFields } from '../FormFields/EditProfileFormFields';
import { StudentDetailsInfo } from '../StudentDetailsInfo';

interface EditProfileTabProps {
  student: Student;
}

export function EditProfileTab({ student }: EditProfileTabProps) {
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
  >((formData) => editAccount(formData, student.id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'current'] });
      queryClient.invalidateQueries({
        queryKey: ['student', { id: student.id.toString() }],
      });
      queryClient.invalidateQueries({ queryKey: ['username'] });
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

  function convertPictureToURL() {
    if (formValues.picture) {
      if (formValues.picture.name === '') {
        return '';
      } else {
        return URL.createObjectURL(formValues.picture);
      }
    }
    return student.picture;
  }

  function convertToPreview(form: EditAccountOptions): Student {
    return {
      description: form.description,
      faculty: form.faculty,
      name: form.firstName + ' ' + form.lastName.toUpperCase(),
      id: -1,
      path: form.path,
      picture: convertPictureToURL(),
      promo: form.promo,
      socialLinks: [],
      emails: [],
      staff: false,
      admin: false,
      url: '',
      username: form.username,
    };
  }

  return (
    <>
      <FlexRow>
        <Avatar
          alt={formValues.firstName + ' ' + formValues.lastName.toUpperCase()}
          src={convertPictureToURL()}
          size="xl"
          sx={{ m: 1 }}
        />
        <StudentDetailsInfo student={convertToPreview(formValues)} />
      </FlexRow>
      <Divider sx={{ my: 2 }} />
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
