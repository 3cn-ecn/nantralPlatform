import { useState } from 'react';

import ShareIcon from '@mui/icons-material/Share';
import { Avatar, Button, List, Paper, useTheme } from '@mui/material';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { getRolesApi } from '#modules/form/api/getRoles.api';
import { removeRoleApi } from '#modules/form/api/removeRole.api';
import { updateRoleApi } from '#modules/form/api/updateRole.api';
import { JsonFormPreview, UserRole } from '#modules/form/types/jsonForm.type';
import { AddUserFields } from '#modules/form/view/RoleModal/AddUserFields';
import { PublicControl } from '#modules/form/view/RoleModal/PublicControl';
import { UserRoleItem } from '#modules/form/view/RoleModal/UserRoleItem';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';

export function RoleModal({
  formPreview,
  onClose,
}: {
  formPreview: JsonFormPreview;
  onClose: () => void;
}) {
  const [removeId, setRemoveId] = useState<number | null>(null);

  const showToast = useToast();
  const { t } = useTranslation();
  const { palette } = useTheme();

  const rolesQuery = useInfiniteQuery({
    queryKey: ['formRoles', formPreview.uuid],
    queryFn: ({ pageParam }) =>
      getRolesApi(formPreview.uuid, { page: pageParam, pageSize: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  });

  const { mutate: deleteRole, isPending: deleteLoading } = useMutation({
    mutationFn: (id: number) => removeRoleApi(id, formPreview.uuid),
    onError: (error: ApiError) => {
      showToast({
        message: error.message,
        variant: 'error',
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['formRoles', formPreview.uuid],
      }),
    onSettled: () => setRemoveId(null),
  });

  const queryClient = useQueryClient();
  const { mutate: updateRole } = useMutation({
    mutationFn: (role: Pick<UserRole, 'id' | 'role'>) =>
      updateRoleApi(role.id, role.role, formPreview.uuid),
    onError: (error: ApiError) => {
      showToast({
        message: error.message,
        variant: 'error',
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['formRoles', formPreview.uuid],
      }),
  });

  return (
    <ResponsiveDialog onClose={onClose}>
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <ShareIcon />
          </Avatar>
        }
      >
        {t('jsonForm.roles.modalTitle', { name: formPreview.name })}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent sx={{ gap: 4 }}>
        <AddUserFields jsonForm={formPreview} />
        <Paper>
          <List>
            <InfiniteList query={rolesQuery}>
              {rolesQuery.data?.pages
                .flatMap((page) => page.results)
                .map((role) => (
                  <UserRoleItem
                    role={role}
                    key={role.id}
                    handleDelete={(id) => setRemoveId(id)}
                    handleUpdate={(id, role) => updateRole({ id, role })}
                  />
                ))}
            </InfiniteList>
          </List>
        </Paper>
        <PublicControl formPreview={formPreview} />
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant={'contained'} onClick={onClose}>
          {t('button.confirm')}
        </Button>
      </ResponsiveDialogFooter>
      {removeId && (
        <ConfirmationModal
          title={t('jsonForm.roles.removeUser.title')}
          body={t('jsonForm.roles.removeUser.body', { name: formPreview.name })}
          onCancel={() => setRemoveId(null)}
          onConfirm={() => deleteRole(removeId)}
          loading={deleteLoading}
        />
      )}
    </ResponsiveDialog>
  );
}
