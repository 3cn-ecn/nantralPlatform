import { FormEvent, useState } from 'react';

import { AdminPanelSettings } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SendAdminRequestApi as sendAdminRequestApi } from '#modules/group/api/sendAdminRequest.api';
import { Group } from '#modules/group/types/group.types';
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
  onClose,
}: {
  group: Group;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { isLoading, mutate } = useMutation(sendAdminRequestApi, {
    onSuccess: (data) => {
      showToast({ message: data.detail, variant: 'success' });
      queryClient.invalidateQueries(['membership', { group: group.slug }]);
      onClose();
    },
  });
  const [formValues, setFormValues] = useState({ message: '' });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ group: group.slug, message: formValues.message });
  }

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="sm">
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={<AdminPanelSettings />}
      >
        Faire une demande d&apos;admin
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="send-admin-request-form" onSubmit={onSubmit}>
          <TextField
            label={'Message'}
            required
            helperText={
              "Demander à avoir les droits d'administration sur ce groupe"
            }
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
          loading={isLoading}
          variant="contained"
        >
          {t('button.send')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
