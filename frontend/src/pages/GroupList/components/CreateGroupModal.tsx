import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Add } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { createGroupApi } from '#modules/group/api/createGroup.api';
import { useGroupFormValues } from '#modules/group/hooks/useGroupFormValues';
import { CreateGroupFormDTO } from '#modules/group/infra/group.dto';
import { CreateGroupForm, Group } from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';
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
  parent,
  disablePortal,
}: {
  onClose: () => void;
  groupType: GroupTypePreview;
  parent?: Group;
  disablePortal?: boolean;
}) {
  const { t } = useTranslation();
  const value = useGroupFormValues({ parent: parent });
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [formValues, setFormValues] = useState<CreateGroupForm>(value);
  const { error, isError, mutate } = useMutation<
    Group,
    ApiFormError<CreateGroupFormDTO>,
    CreateGroupForm
  >(() => createGroupApi(groupType.slug, formValues), {
    onSuccess: (group) => {
      onClose();
      navigate(group.url);
    },
  });
  const isLoading = false;

  function updateFormValues(val: Partial<CreateGroupForm>) {
    setFormValues({ ...formValues, ...val });
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }
  return (
    <ResponsiveDialog
      onClose={onClose}
      disableEnforceFocus
      disablePortal={disablePortal}
    >
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <Add />
          </Avatar>
        }
      >
        {t('group.modal.createGroup.title')}
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
            prevData={{ parent }}
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
