import { useState } from 'react';

import { Button, List, Paper } from '@mui/material';
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
import { UserRoleItem } from '#modules/form/view/RoleModal/UserRoleItem';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { useToast } from '#shared/context/Toast.context';
import { ApiError } from '#shared/infra/errors';

export function RoleModal({
  jsonForm,
  onClose,
}: {
  jsonForm: JsonFormPreview;
  onClose: () => void;
}) {
  const [removeId, setRemoveId] = useState<number | null>(null);

  const showToast = useToast();

  const { data: roles } = useInfiniteQuery({
    queryKey: ['formRoles', jsonForm.uuid],
    queryFn: ({ pageParam }) =>
      getRolesApi(jsonForm.uuid, { page: pageParam, pageSize: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  });

  const { mutate: deleteRole, isPending: deleteLoading } = useMutation({
    mutationFn: (id: number) => removeRoleApi(id, jsonForm.uuid),
    onError: (error: ApiError) => {
      showToast({
        message: error.message,
        variant: 'error',
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['formRoles', jsonForm.uuid] }),
    onSettled: () => setRemoveId(null),
  });

  const queryClient = useQueryClient();
  const { mutate: updateRole } = useMutation({
    mutationFn: (role: Pick<UserRole, 'id' | 'role'>) =>
      updateRoleApi(role.id, role.role, jsonForm.uuid),
    onError: (error: ApiError) => {
      showToast({
        message: error.message,
        variant: 'error',
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['formRoles', jsonForm.uuid],
      }),
  });

  return (
    <ResponsiveDialog onClose={onClose}>
      <ResponsiveDialogHeader onClose={onClose}>
        Edit roles for form {jsonForm.name}
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent sx={{ gap: 1 }}>
        <AddUserFields jsonForm={jsonForm} />
        <Paper>
          <List>
            {roles?.pages
              .flatMap((page) => page.results)
              .map((role) => (
                <UserRoleItem
                  role={role}
                  key={role.id}
                  handleDelete={(id) => setRemoveId(id)}
                  handleUpdate={(id, role) => updateRole({ id, role })}
                />
              ))}
          </List>
        </Paper>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant={'contained'} onClick={onClose}>
          Close
        </Button>
      </ResponsiveDialogFooter>
      {removeId && (
        <ConfirmationModal
          title={'Removing user'}
          body={`Are you sure you want to remove access to the form ${jsonForm.name} to this user?`}
          onCancel={() => setRemoveId(null)}
          onConfirm={() => deleteRole(removeId)}
          loading={deleteLoading}
        />
      )}
    </ResponsiveDialog>
  );
}
