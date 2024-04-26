import { FormEvent, useState } from 'react';

import { Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { createGroupApi } from '#modules/group/api/createGroup.api';
import { useGroupFormValues } from '#modules/group/hooks/useGroupFormValues';
import { CreateGroupForm, Group } from '#modules/group/types/group.types';
import { GroupFormFields } from '#modules/group/view/shared/GroupFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export function CreateGroupModal({
  onClose,
  groupType,
}: {
  onClose: () => void;
  groupType: string;
}) {
  const { t } = useTranslation();
  const value = useGroupFormValues();
  const [formValues, setFormValues] = useState<CreateGroupForm>(value);
  const { error, isError, mutate } = useMutation<
    Group,
    ApiFormError<CreateGroupForm>,
    CreateGroupForm
  >(() => createGroupApi(groupType, formValues));
  const isLoading = false;

  function updateFormValues(val: Partial<CreateGroupForm>) {
    setFormValues({ ...formValues, ...val });
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }
  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus>
      <ResponsiveDialogHeader
        onClose={onClose}
        // helpUrl="https://docs.nantral-platform.fr/user/posts-events/create-event"
      >
        {t('event.createModal.title')}
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="create-group-form" onSubmit={(e) => onSubmit(e)}>
          <GroupFormFields
            isError={isError}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
            groupType={groupType}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="create-group-form"
          type="submit"
          loading={isLoading}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
