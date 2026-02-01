import { FormEvent, useState } from 'react';

import { PersonAdd } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMembershipApi } from '#modules/group/api/createMembership.api';
import { MembershipFormDTO } from '#modules/group/infra/membership.dto';
import { CreateGroupForm, Group } from '#modules/group/types/group.types';
import {
  Membership,
  MembershipForm,
} from '#modules/group/types/membership.types';
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

import { MembershipFormFields } from '../shared/MembershipFormFields';

export function ModalAddMember({
  onClose,
  group,
}: {
  onClose: () => void;
  group: Group;
}) {
  const { t } = useTranslation();
  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(today.getFullYear() + 1);
  const [formValues, setFormValues] = useState<MembershipForm>({
    beginDate: today,
    endDate: oneYear,
    description: '',
    group: group.id,
    student: -1,
    summary: '',
    admin: false,
  });
  const queryClient = useQueryClient();
  const { palette } = useTheme();
  const { error, isError, mutate, isPending } = useMutation<
    Membership,
    ApiFormError<MembershipFormDTO>,
    MembershipForm
  >({
    mutationFn: () => createMembershipApi(formValues),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['group', { slug: group.slug }],
      });
      queryClient.invalidateQueries({
        queryKey: ['members', { slug: group.slug }],
      });
      onClose();
    },
  });

  function updateFormValues(val: Partial<CreateGroupForm>) {
    setFormValues({ ...formValues, ...val });
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="sm">
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <PersonAdd />
          </Avatar>
        }
      >
        {t('group.details.addMember')}
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="edit-group-form" onSubmit={(e) => onSubmit(e)}>
          <MembershipFormFields
            isError={isError}
            isAdmin={group.isAdmin}
            error={error}
            formValues={formValues}
            updateFormValues={updateFormValues}
            selectStudent
            showDates={!group.groupType.noMembershipDates}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="edit-group-form"
          type="submit"
          loading={isPending}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
