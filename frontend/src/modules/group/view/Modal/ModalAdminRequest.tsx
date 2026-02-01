import { FormEvent, useState } from 'react';

import { AdminPanelSettings } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sendAdminRequestApi } from '#modules/group/api/sendAdminRequest.api';
import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { TextField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export function ModalAdminRequest({
  group,
  membership,
  onClose,
}: {
  membership: Membership;
  group: Group;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { isPending, mutate } = useMutation({
    mutationFn: sendAdminRequestApi,
    onSuccess: (data) => {
      showToast({ message: data.detail, variant: 'success' });
      queryClient.invalidateQueries({
        queryKey: ['membership', { group: group.slug }],
      });
      onClose();
    },
  });
  const [formValues, setFormValues] = useState({ message: '' });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ membership: membership.id, message: formValues.message });
  }

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="sm">
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={<AdminPanelSettings />}
      >
        {t('group.details.makeAdminRequest')}
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="send-admin-request-form" onSubmit={onSubmit}>
          <TextField
            label={t('group.details.form.message.label')}
            required
            helperText={t('group.details.form.message.helperText')}
            multiline
            value={formValues.message}
            handleChange={(val) => setFormValues({ message: val })}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="send-admin-request-form"
          type="submit"
          loading={isPending}
          variant="contained"
        >
          {t('button.send')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
