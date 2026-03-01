import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  CircularProgress,
  List,
  Paper,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { deleteGroupHistoryApi } from '#modules/group/api/deleteGroupHistory.api';
import { getGroupHistoryListApi } from '#modules/group/api/getGroupHistoryList.api';
import { restoreGroupHistoryApi } from '#modules/group/api/restoreGroupHistory.api';
import { Group } from '#modules/group/types/group.types';
import { GroupHistory } from '#modules/group/types/groupHistory.type';
import { HistoryListItem } from '#modules/group/view/EditHistoryView/components/HistoryListItem';
import { ModalEditChangeReason } from '#modules/group/view/EditHistoryView/components/ModalEditChangeReason';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';

interface EditMembersViewProps {
  group: Group;
  onClose: () => void;
}

export function EditHistoryView({ group, onClose }: EditMembersViewProps) {
  const [selected, setSelected] = useState<GroupHistory>();
  const [deleteSelected, setDeleteSelected] = useState<GroupHistory>();
  const [restoreSelected, setRestoreSelected] = useState<GroupHistory>();
  const showToast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const queryKey = ['history', { slug: group.slug }];

  const deleteMutation = useMutation<number, ApiError, number>({
    mutationFn: (pk: number) => deleteGroupHistoryApi(group.slug, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(['group', { slug: group.slug }]);
      showToast({
        message: t('group.details.modal.editGroup.deleteHistorySuccess'),
        variant: 'success',
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        variant: 'error',
      });
    },
  });

  const restoreMutation = useMutation<number, ApiError, number>({
    mutationFn: (pk: number) => restoreGroupHistoryApi(group.slug, pk),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(['group', { slug: group.slug }]);
      showToast({
        message: t('group.details.modal.editGroup.restoreHistorySuccess'),
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

  const {
    data: records,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () => getGroupHistoryListApi(group.slug),
    keepPreviousData: true,
  });

  if (!records) {
    return;
  }

  return (
    <>
      <Typography variant="h3" mb={1}>
        {t('group.details.modal.editGroup.history')}
      </Typography>
      {isLoading && <CircularProgress />}
      {isError && (
        <Alert severity="error">
          {t('group.details.modal.editGroup.error')}
        </Alert>
      )}
      {isSuccess && records.count > 0 && (
        <Paper>
          <List>
            {records.results.map((record) => (
              <HistoryListItem
                item={record}
                onClickDelete={() => setDeleteSelected(record)}
                onClickEdit={() => setSelected(record)}
                onClickView={() => {
                  navigate(`/group/@${group.slug}/?version=${record.pk}`);
                  onClose();
                }}
                key={record.pk}
                onClickRestore={() => setRestoreSelected(record)}
              />
            ))}
          </List>
        </Paper>
      )}
      {isSuccess && records?.count === 0 && (
        <Typography>{t('group.details.modal.editGroup.noMembers')}</Typography>
      )}
      {selected && (
        <ModalEditChangeReason
          item={selected}
          group={group}
          onClose={() => {
            setSelected(undefined);
          }}
        />
      )}
      {deleteSelected && (
        <ConfirmationModal
          title={t('group.details.modal.editHistory.confirmDeleteTitle')}
          body={t('group.details.modal.editHistory.confirmDeleteBody')}
          onCancel={() => setDeleteSelected(undefined)}
          onConfirm={() => {
            deleteMutation.mutate(deleteSelected.pk);
            setDeleteSelected(undefined);
          }}
        />
      )}
      {restoreSelected && (
        <ConfirmationModal
          title={t('group.details.modal.editHistory.confirmRestoreTitle')}
          body={t('group.details.modal.editHistory.confirmRestoreBody')}
          onCancel={() => setRestoreSelected(undefined)}
          onConfirm={() => {
            restoreMutation.mutate(restoreSelected.pk);
            setRestoreSelected(undefined);
          }}
        />
      )}
    </>
  );
}
