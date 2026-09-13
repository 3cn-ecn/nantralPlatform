import { FC, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import ResultsIcon from '@mui/icons-material/List';
import ShareIcon from '@mui/icons-material/Share';
import ViewIcon from '@mui/icons-material/Visibility';
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { deleteFormApi } from '#modules/form/api/deleteForm.api';
import { setFormActiveApi } from '#modules/form/api/setFormActive.api';
import { setFormInactiveApi } from '#modules/form/api/setFormInactive.api';
import {
  JsonFormPreview,
  JsonFormSchema,
} from '#modules/form/types/jsonForm.type';
import { RoleModal } from '#modules/form/view/RoleModal/RoleModal';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { MoreActionsButton } from '#shared/components/MoreActionsButton/MoreActionsButton';
import { useToast } from '#shared/context/Toast.context';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';
import { Page } from '#shared/infra/pagination';
import { buildAbsoluteUrl } from '#shared/utils/urls';

interface Action {
  Icon: FC;
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
  const { t } = useTranslation();

  const [rolesModalOpen, setRolesModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [activeModalOpen, setActiveModalOpen] = useState(false);

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

  const { mutate: activeMutation, isPending: activePending } = useMutation({
    mutationFn: () =>
      formPreview.active
        ? setFormInactiveApi(formPreview.uuid)
        : setFormActiveApi(formPreview.uuid),
    onSuccess() {
      setActiveModalOpen(false);
      queryClient.setQueriesData(
        { queryKey: ['forms'] },
        (data: InfiniteData<Page<JsonFormPreview>>) => ({
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            results: page.results.map((form) =>
              form.uuid === formPreview.uuid
                ? { ...form, active: !form.active }
                : form,
            ),
          })),
        }),
      );
      queryClient.setQueriesData(
        { queryKey: ['form', formPreview.uuid] },
        (form: JsonFormSchema) => ({ ...form, active: !form.active }),
      );
    },
  });

  const handleCopy = useCallback(
    () =>
      window.navigator.clipboard
        .writeText(buildAbsoluteUrl(`/form/${formPreview.uuid}/`))
        .then(() =>
          showToast({
            message: t('jsonForm.details.copy.success'),
            variant: 'success',
          }),
        )
        .catch((e) => {
          showToast({
            message: t('jsonForm.details.copy.error'),
            variant: 'error',
          });
          throw e;
        }),
    [formPreview.uuid, showToast, t],
  );

  const baseActions: Action[] = useMemo(
    () => [
      {
        label: t('jsonForm.details.preview'),
        Icon: ViewIcon,
        clickableProps: { component: Link, to: `/form/${formPreview.uuid}/` },
      },
    ],
    [formPreview.uuid, t],
  );
  const answerActions = useMemo(
    () => [
      {
        label: t('jsonForm.details.viewResults'),
        Icon: ResultsIcon,
        clickableProps: {
          component: Link,
          to: `/form/${formPreview.uuid}/results/`,
        },
      },
      {
        label: t('jsonForm.details.link'),
        Icon: LinkIcon,
        clickableProps: { onClick: handleCopy },
      },
    ],
    [formPreview.uuid, handleCopy, t],
  );
  const editActions: Action[] = useMemo(
    () => [
      ...(formPreview.editable
        ? [
            {
              label: t('button.edit'),
              Icon: EditIcon,
              clickableProps: {
                component: Link,
                to: `/form/${formPreview.uuid}/edit/`,
              },
            },
          ]
        : []),
      {
        label: formPreview.active
          ? t('jsonForm.details.active')
          : t('jsonForm.details.closed'),
        Icon: activePending
          ? () => <CircularProgress size={'1em'} />
          : formPreview.active
            ? CheckOutlinedIcon
            : CloseOutlinedIcon,
        clickableProps: {
          onClick: () =>
            formPreview.active ? activeMutation() : setActiveModalOpen(true),
        },
      },
      {
        label: t('jsonForm.details.share'),
        Icon: ShareIcon,
        clickableProps: { onClick: () => setRolesModalOpen(true) },
      },
      {
        label: t('button.delete'),
        Icon: DeleteIcon,
        clickableProps: { onClick: () => setDeleteModalOpen(true) },
      },
    ],
    [
      activeMutation,
      activePending,
      formPreview.active,
      formPreview.editable,
      formPreview.uuid,
      t,
    ],
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
            formPreview={formPreview}
            onClose={() => setRolesModalOpen(false)}
          />
        )}
        {deleteModalOpen && (
          <ConfirmationModal
            title={t('jsonForm.details.delete.title', {
              name: formPreview.name,
            })}
            body={t('jsonForm.details.delete.body')}
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={() => deleteForm(formPreview.uuid)}
            loading={deleteLoading}
          />
        )}
        {activeModalOpen && (
          <ConfirmationModal
            title={t('jsonForm.details.setActive.title')}
            body={t('jsonForm.details.setActive.body')}
            onCancel={() => setActiveModalOpen(false)}
            onConfirm={activeMutation}
          />
        )}
      </>
    ),
    [
      rolesModalOpen,
      formPreview,
      deleteModalOpen,
      deleteLoading,
      activeModalOpen,
      t,
      activeMutation,
      deleteForm,
    ],
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
