import { useState } from 'react';

import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateGroupHistoryApi } from '#modules/group/api/updateGroupHistory.api';
import { GroupHistoryFormDTO } from '#modules/group/infra/groupHistory.dto';
import { Group } from '#modules/group/types/group.types';
import {
  GroupHistory,
  GroupHistoryForm,
} from '#modules/group/types/groupHistory.type';
import { TextField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface EditChangeReasonModalProps {
  item: GroupHistory;
  onClose: () => void;
  group: Group;
}

export function ModalEditChangeReason({
  item,
  onClose,
  group,
}: EditChangeReasonModalProps) {
  const queryKey = ['history', { slug: group.slug }];
  const queryClient = useQueryClient();
  const showToast = useToast();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<GroupHistoryForm>(item);
  const { isLoading, mutate } = useMutation<
    GroupHistory,
    ApiFormError<GroupHistoryFormDTO>,
    number
  >({
    mutationFn: (pk) => updateGroupHistoryApi(group.slug, pk, formValues),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      showToast({
        message: t('group.details.modal.editGroup.editHistorySuccess'),
        variant: 'success',
      });
      onClose();
    },
    onError: (error) => {
      showToast({
        message: error.message,
        variant: 'error',
      });
    },
  });
  return (
    <ResponsiveDialog onClose={onClose}>
      <ResponsiveDialogHeader onClose={onClose} leftIcon={<Edit />}>
        {t('group.details.modal.editHistory.changeReasonModal')}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form
          id={'edit-history-form'}
          onSubmit={(e) => {
            e.preventDefault();
            mutate(item.pk);
          }}
        >
          <TextField
            handleChange={(val) =>
              setFormValues({ ...formValues, historyChangeReason: val })
            }
            value={formValues.historyChangeReason}
            label={t('group.details.modal.editHistory.changeReasonInput')}
            fullWidth
            multiline
            minRows={3}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="edit-history-form"
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
