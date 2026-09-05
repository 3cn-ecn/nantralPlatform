import { useState } from 'react';

import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { deleteFormApi } from '#modules/form/api/deleteForm.api';
import { getFormListApi } from '#modules/form/api/getFormList.api';
import { JsonFormPreview } from '#modules/form/types/jsonForm.type';
import { FormListItem } from '#modules/form/view/RoleModal/FormListItem';
import { RoleModal } from '#modules/form/view/RoleModal/RoleModal';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useToast } from '#shared/context/Toast.context';
import { ApiError } from '#shared/infra/errors';

export default function FormListPage() {
  const showToast = useToast();
  const queryClient = useQueryClient();

  const formsQuery = useInfiniteQuery({
    queryKey: ['forms'],
    queryFn: ({ pageParam }) => getFormListApi({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  });

  const [jsonFormModal, setJsonFormModal] = useState<JsonFormPreview | null>(
    null,
  );

  const [deleteFormModal, setDeleteFormModal] =
    useState<JsonFormPreview | null>(null);

  const { mutate: deleteForm, isPending: deleteLoading } = useMutation({
    mutationFn: deleteFormApi,
    onError: (error: ApiError) =>
      showToast({
        message: error.message,
        variant: 'error',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forms'] }),
    onSettled: () => setDeleteFormModal(null),
  });

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant={'h1'} sx={{ mb: 3 }}>
        Formulaires
      </Typography>
      <InfiniteList query={formsQuery}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>Form</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formsQuery.data?.pages
                .flatMap((page) => page.results)
                .map((formPreview) => (
                  <FormListItem
                    key={formPreview.uuid}
                    formPreview={formPreview}
                    handleShare={() => setJsonFormModal(formPreview)}
                    handleRemove={() => setDeleteFormModal(formPreview)}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </InfiniteList>
      {jsonFormModal && (
        <RoleModal
          jsonForm={jsonFormModal}
          onClose={() => setJsonFormModal(null)}
        />
      )}
      {deleteFormModal && (
        <ConfirmationModal
          title={`Delete form ${deleteFormModal.name} ?`}
          body={
            'Do you really want to delete this form. This action cannot be undone'
          }
          onCancel={() => setDeleteFormModal(null)}
          onConfirm={() => deleteForm(deleteFormModal.uuid)}
          loading={deleteLoading}
        />
      )}
    </Container>
  );
}
