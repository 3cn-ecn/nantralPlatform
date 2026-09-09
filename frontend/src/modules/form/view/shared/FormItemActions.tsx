import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { SvgIconComponent } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import ResultsIcon from '@mui/icons-material/List';
import ShareIcon from '@mui/icons-material/Share';
import ViewIcon from '@mui/icons-material/Visibility';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteFormApi } from '#modules/form/api/deleteForm.api';
import { JsonFormPreview } from '#modules/form/types/jsonForm.type';
import { RoleModal } from '#modules/form/view/RoleModal/RoleModal';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { MoreActionsButton } from '#shared/components/MoreActionsButton/MoreActionsButton';
import { useToast } from '#shared/context/Toast.context';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { ApiError } from '#shared/infra/errors';
import { buildAbsoluteUrl } from '#shared/utils/urls';

interface Action {
  Icon: SvgIconComponent;
  label: string;
  clickableProps:
    { onClick: () => void } | { component: typeof Link; to: string };
}

export function FormItemActions({
  formPreview,
}: {
  formPreview: JsonFormPreview;
}) {
  const { isSmaller: isMobile } = useBreakpoint('sm');
  const [open, setOpen] = useState(false);
  const showToast = useToast();
  const queryClient = useQueryClient();

  const [rolesModalOpen, setRolesModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { mutate: deleteForm, isPending: deleteLoading } = useMutation({
    mutationFn: deleteFormApi,
    onError: (error: ApiError) =>
      showToast({
        message: error.message,
        variant: 'error',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forms'] }),
    onSettled: () => setDeleteModalOpen(false),
  });
  const handleCopy = useCallback(
    () =>
      window.navigator.clipboard
        .writeText(buildAbsoluteUrl(`/form/${formPreview.uuid}/`))
        .then(() =>
          showToast({
            message: 'The url was successfully copied',
            variant: 'success',
          }),
        )
        .catch((e) => {
          showToast({
            message: 'We were not able to copy this text',
            variant: 'error',
          });
          throw e;
        }),
    [formPreview.uuid, showToast],
  );

  const baseActions: Action[] = useMemo(
    () => [
      {
        label: 'Preview form',
        Icon: ViewIcon,
        clickableProps: { component: Link, to: `/form/${formPreview.uuid}/` },
      },
    ],
    [formPreview.uuid],
  );
  const answerActions = useMemo(
    () => [
      {
        label: 'View Results',
        Icon: ResultsIcon,
        clickableProps: {
          component: Link,
          to: `/form/${formPreview.uuid}/results/`,
        },
      },
      {
        label: 'Copy Link',
        Icon: LinkIcon,
        clickableProps: { onClick: handleCopy },
      },
    ],
    [formPreview.uuid, handleCopy],
  );
  const editActions: Action[] = useMemo(
    () => [
      {
        label: 'Edit',
        Icon: EditIcon,
        clickableProps: {
          component: Link,
          to: `/form/${formPreview.uuid}/edit/`,
        },
      },
      {
        label: 'Share',
        Icon: ShareIcon,
        clickableProps: { onClick: () => setRolesModalOpen(true) },
      },
      {
        label: 'Delete',
        Icon: DeleteIcon,
        clickableProps: { onClick: () => setDeleteModalOpen(true) },
      },
    ],
    [formPreview.uuid],
  );

  const actions = useMemo(
    () => [
      ...(formPreview.canViewForm ? baseActions : []),
      ...(formPreview.canViewAnswers ? answerActions : []),
      ...(formPreview.isAdmin ? editActions : []),
    ],
    [
      answerActions,
      baseActions,
      editActions,
      formPreview.canViewAnswers,
      formPreview.canViewForm,
      formPreview.isAdmin,
    ],
  );

  const modals = useMemo(
    () => (
      <>
        {rolesModalOpen && (
          <RoleModal
            jsonForm={formPreview}
            onClose={() => setRolesModalOpen(false)}
          />
        )}
        {deleteModalOpen && (
          <ConfirmationModal
            title={`Delete form ${formPreview.name} ?`}
            body={
              'Do you really want to delete this form. This action cannot be undone'
            }
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={() => deleteForm(formPreview.uuid)}
            loading={deleteLoading}
          />
        )}
      </>
    ),
    [rolesModalOpen, formPreview, deleteModalOpen, deleteLoading, deleteForm],
  );

  if (isMobile) {
    if (actions.length === 0) return null;
    return (
      <>
        <MoreActionsButton menuIsOpen={open} setMenuIsOpen={setOpen}>
          {actions.map((action) => (
            <MenuItem key={action.label} {...action.clickableProps}>
              <ListItemIcon>
                <action.Icon />
              </ListItemIcon>
              <ListItemText primary={action.label} />
            </MenuItem>
          ))}
        </MoreActionsButton>

        {modals}
      </>
    );
  }
  return (
    <Stack direction={'row'}>
      {actions.map((action) => (
        <Tooltip title={action.label} key={action.label} arrow>
          <IconButton {...action.clickableProps}>
            <action.Icon />
          </IconButton>
        </Tooltip>
      ))}
      {modals}
    </Stack>
  );
}
