import { FormEvent, useState } from 'react';

import { Divider } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  editAccountApi,
  EditAccountOptions,
  EditAccountOptionsDTO,
} from '#modules/account/api/editAccount.api';
import { User } from '#modules/account/user.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { EditProfileFormFields } from '../FormFields/EditProfileFormFields';
import { StudentDetailsInfo } from '../StudentDetailsInfo';

interface EditProfileTabProps {
  user: User;
}

export function EditProfileTab({ user }: EditProfileTabProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [formValues, setFormValues] = useState<EditAccountOptions>({
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ')[1],
    description: user.description,
    faculty: user.faculty,
    path: user.path,
    promo: user.promo,
    picture: undefined,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const { error, mutate, isLoading } = useMutation<
    EditAccountOptionsDTO,
    ApiFormError<EditAccountOptionsDTO>,
    EditAccountOptions
  >((formData) => editAccountApi(formData, user.id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
      queryClient.invalidateQueries({
        queryKey: ['user', { id: user.id.toString() }],
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
    return user.picture;
  }

  function convertToPreview(form: EditAccountOptions): User {
    return {
      description: form.description,
      faculty: form.faculty,
      name: form.firstName + ' ' + form.lastName.toUpperCase(),
      id: user.id,
      path: form.path,
      picture: convertPictureToURL(),
      promo: form.promo,
      socialLinks: user.socialLinks,
      emails: user.emails,
      staff: user.staff,
      admin: user.admin,
      url: user.url,
      username: user.username,
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
        <StudentDetailsInfo user={convertToPreview(formValues)} />
      </FlexRow>
      <Divider sx={{ my: 2 }} />
      <form id="edit-account-form" onSubmit={(e) => onSubmit(e)}>
        <EditProfileFormFields
          formValues={formValues}
          previousValues={user}
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
